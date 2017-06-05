import { CSharpType, TypeParser } from 'fluffy-spoon.javascript.csharp-parser';
import { RegExHelper } from './RegExHelper';
import { StringEmitter } from './StringEmitter';
import { Logger } from './Logger';

export interface TypeEmitOptions {
	mapper?: (type: CSharpType, suggestedOutput: string) => string;
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
			"HashSet<T>": "T[]",
			"IDictionary<T,K>": "{ [key: T]: K }",
			"Task<T>": "Promise<T>",
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

	emitType(type: CSharpType, options?: TypeEmitOptions) {
		options = this.prepareOptions(options);

		this.logger.log("Emitting type " + type.fullName);

		var mapping = this.getMatchingTypeMapping(type, options);
		this.stringEmitter.write(mapping);
	}

	private prepareOptions(options?: TypeEmitOptions) {
		if (!options) {
			options = {};
		}

		return options;
	}

	private getNonGenericTypeName(type: CSharpType) {
		var typeName = type.name;
		if (type.genericParameters) {
			var lastArrowIndex = typeName.lastIndexOf("<");
			typeName = typeName.substr(0, lastArrowIndex);
		}

		return typeName;
	}

	private getMatchingTypeMapping(
		type: CSharpType,
		options?: TypeEmitOptions) {

		if (options && options.mapper) {
			let mapping = options.mapper(type, this.getMatchingTypeMapping(type));
			if (mapping) {
				return mapping;
			}
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

		return type.name;
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
        
		var realTypeMapping = this.getMatchingTypeMapping(realType, options);
		var referenceNameInput = this.regexHelper.escape(referenceType.name);

		var pattern = new RegExp("((?:[^\\w]|^)+)(" + referenceNameInput + ")((?:[^\\w]|$)+)", "g");
		mapping = mapping.replace(pattern, "$1" + realTypeMapping + "$3");

		return mapping;
	}
}