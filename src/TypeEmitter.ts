import { CSharpType, TypeParser } from 'fluffy-spoon.javascript.csharp-parser';
import { RegExHelper } from './RegExHelper';
import { StringEmitter } from './StringEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface TypeEmitOptionsBase {
	mapper?: (type: CSharpType, suggestedOutput: string) => string;
	filter?: (type: CSharpType) => boolean;
}

export interface TypeEmitOptions extends TypeEmitOptionsBase {
}

export class TypeEmitter {
	private defaultTypeMap: { [sourceType: string]: string } & Object;
	private typeParser: TypeParser;
	private regexHelper: RegExHelper;

	constructor(
		private stringEmitter: StringEmitter,
        private logger: Logger
	) {
		this.typeParser = new TypeParser();
		this.regexHelper = new RegExHelper();

		this.defaultTypeMap = {
			"IList<T>": "T[]",
			"List<T>": "T[]",
			"IEnumerable<T>": "T[]",
			"ICollection<T>": "T[]",
			"Array<T>": "T[]",
			"HashSet<T>": "T[]",
			"IDictionary<T,K>": "{ [key: T]: K }",
			"Task<T>": "Promise<T>",
			"Task": "Promise<void>",
			"int": "number",
			"double": "number",
			"float": "number",
			"Int32": "number",
			"Int64": "number",
			"short": "number",
			"long": "number",
			"decimal": "number",
			"bool": "boolean",
			"DateTime": "string",
			"Guid": "string",
			"dynamic": "any",
			"object": "any"
		};
	}

	canEmitType(type: CSharpType, options: TypeEmitOptions) {
		return options.filter(type);
	}

	emitType(type: CSharpType, options: TypeEmitOptions) {
		var node = this.createTypeScriptTypeReferenceNode(type, options);
		if(!node)
			return;

		this.stringEmitter.emitTypeScriptNode(node);
	}

	emitGenericParameters(genericParameters: CSharpType[], options: TypeEmitOptions) {
		this.stringEmitter.write(this.generateGenericParametersString(genericParameters, options));
	}

	createTypeScriptExpressionWithTypeArguments(type: CSharpType, options: TypeEmitOptions) {
		var typeName = this.getNonGenericMatchingTypeMappingAsString(type, options);
		return ts.createExpressionWithTypeArguments(
			this.createTypeScriptTypeReferenceNodes(
				type.genericParameters || [],
				options),
			ts.createIdentifier(typeName));
	}

	createTypeScriptTypeReferenceNode(type: CSharpType, options: TypeEmitOptions) {
		if (!this.canEmitType(type, options))
			return null;

		this.logger.log("Emitting type", type);

		var type = this.getMatchingTypeMappingAsType(type, options);
		var node = this.createTypeScriptTypeReferenceNodes(
			[type], 
			options)[0];

		this.logger.log("Done emitting type", type);

		return node;
	}
	
	createTypeScriptTypeParameterDeclaration(type: CSharpType, options: TypeEmitOptions) {
		return ts.createTypeParameterDeclaration(
			this.getNonGenericMatchingTypeMappingAsString(type, options));
	}

	createTypeScriptTypeReferenceNodes(types: CSharpType[], options: TypeEmitOptions) {
		var nodes = new Array<ts.TypeReferenceNode>();
		if(!types)
			return nodes;

		for(var type of types) {
			var node = ts.createTypeReferenceNode(
				this.getNonGenericTypeName(type),
				this.createTypeScriptTypeReferenceNodes(type.genericParameters, options));
			nodes.push(node);
		}

		return nodes;
	}

	private getNonGenericTypeName(type: CSharpType) {
		var typeName = type.name;
		if (type.genericParameters) {
			var lastArrowIndex = typeName.lastIndexOf("<");
			typeName = typeName.substr(0, lastArrowIndex);
		}

		return typeName;
	}

	private getNonGenericMatchingTypeMappingAsString(
		type: CSharpType,
		options: TypeEmitOptions) {

		var mapping = this.getMatchingTypeMappingAsType(type, options);
		var typeName = this.getNonGenericTypeName(mapping);
		return typeName;
	}

	private getMatchingTypeMappingAsType(
		type: CSharpType,
		options: TypeEmitOptions) {

		var mapping = this.getMatchingTypeMappingAsString(type, options);
		var type = this.typeParser.parseType(mapping);
		return type;
	}

	private getMatchingTypeMappingAsString(
		type: CSharpType,
		options: TypeEmitOptions) {

		if (options && options.mapper) {
			let mappedValue: string = options.mapper(
				type, 
				this.getMatchingTypeMappingAsString(
					type,
					options));
			this.logger.log("mapping", type, mappedValue);
			if(mappedValue)
				return mappedValue;
		}
        
		for (var mappingKey in this.defaultTypeMap) {
			if (!this.defaultTypeMap.hasOwnProperty(mappingKey))
				continue;

			var mappingKeyType = this.typeParser.parseType(mappingKey);
			if (type.name !== mappingKeyType.name)
				continue;

			let mapping = this.defaultTypeMap[mappingKey];
			if (mappingKeyType.genericParameters) {
				mapping = this.substituteMultipleGenericReferencesIntoMapping(
					mappingKeyType,
					type,
					mapping,
					options);
			}

			return mapping;
		}

		let mappedValue = this.getNonGenericTypeName(type);
		if(type.genericParameters) {
			mappedValue += this.generateGenericParametersString(type.genericParameters, options);
		}

		return mappedValue;
	}

	private generateGenericParametersString(genericParameters: CSharpType[], options: TypeEmitOptions) {
		var mapping = "<";
		for(var genericParameter of genericParameters) {
			mapping += this.getMatchingTypeMappingAsString(genericParameter, options);
			if(genericParameter !== genericParameters[genericParameters.length-1])
				mapping += ", ";
		}
		mapping += ">";
		return mapping;
	}

	private substituteMultipleGenericReferencesIntoMapping(
		mappingKeyType: CSharpType,
		concreteType: CSharpType,
		mapping: string,
		options: TypeEmitOptions) {

		for (var i = 0; i < mappingKeyType.genericParameters.length; i++) {
			var mappingGenericParameter = mappingKeyType.genericParameters[i];
			var mappingRealParameter = concreteType.genericParameters[i];

			if (mappingGenericParameter.genericParameters) {
				mapping = this.substituteMultipleGenericReferencesIntoMapping(
					mappingGenericParameter,
					mappingRealParameter,
					mapping,
					options);
			}

			mapping = this.substituteGenericReferenceIntoMapping(
				mappingGenericParameter,
				mappingRealParameter,
				mapping,
				options);
		}

		return mapping;
	}

	private substituteGenericReferenceIntoMapping(
		referenceType: CSharpType,
		realType: CSharpType,
		mapping: string,
		options: TypeEmitOptions) {
        
		var realTypeMapping = this.getMatchingTypeMappingAsString(realType, options);
		var referenceNameInput = this.regexHelper.escape(referenceType.name);

		var pattern = new RegExp("((?:[^\\w]|^)+)(" + referenceNameInput + ")((?:[^\\w]|$)+)", "g");
		mapping = mapping.replace(pattern, "$1" + realTypeMapping + "$3");

		return mapping;
	}
}