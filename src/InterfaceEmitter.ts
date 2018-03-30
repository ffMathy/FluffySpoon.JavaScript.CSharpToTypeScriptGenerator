import { FileParser, CSharpClass, CSharpInterface } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitter, PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitter, FieldEmitOptions } from './FieldEmitter';
import { MethodEmitter, MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { OptionsHelper } from './OptionsHelper';

export interface InterfaceEmitOptionsBase {
	declare?: boolean;
	filter?: (method: CSharpInterface) => boolean;
	perInterfaceEmitOptions?: (interfaceObject: CSharpInterface) => PerInterfaceEmitOptions;
}

export interface InterfaceEmitOptionsLinks {
	propertyEmitOptions?: PropertyEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	genericParameterTypeEmitOptions?: TypeEmitOptions;
	inheritedTypeEmitOptions?: TypeEmitOptions;
}

export interface InterfaceEmitOptions extends InterfaceEmitOptionsBase, InterfaceEmitOptionsLinks {
}

export interface PerInterfaceEmitOptions extends InterfaceEmitOptionsBase, InterfaceEmitOptionsLinks {
	name?: string;
}

export class InterfaceEmitter {
	private optionsHelper: OptionsHelper;
	private propertyEmitter: PropertyEmitter;
	private methodEmitter: MethodEmitter;
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.propertyEmitter = new PropertyEmitter(stringEmitter, logger);
		this.methodEmitter = new MethodEmitter(stringEmitter, logger);
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
		this.optionsHelper = new OptionsHelper();
	}

	emitInterfaces(interfaces: CSharpInterface[], options: InterfaceEmitOptions) {
		this.logger.log("Emitting interfaces", interfaces);

		for (var interfaceObject of interfaces) {
			this.emitInterface(interfaceObject, options);
		}

		this.stringEmitter.removeLastNewLines();

		this.logger.log("Done emitting interfaces", interfaces);
	}

	emitInterface(interfaceObject: CSharpInterface, options: InterfaceEmitOptions) {
		var nodes = this.createTypeScriptInterfaceNodes(interfaceObject, options);
		for (var node of nodes)
			this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptInterfaceNodes(interfaceObject: CSharpInterface, options: InterfaceEmitOptions & PerInterfaceEmitOptions) {
		if(options.perInterfaceEmitOptions)
			options = this.optionsHelper.mergeOptionsRecursively<any>(
				options.perInterfaceEmitOptions(interfaceObject), 
				options);

		if (!options.filter(interfaceObject))
			return [];

		if (interfaceObject.properties.length === 0 && interfaceObject.methods.length === 0) {
			this.logger.log("Skipping emitting body of interface " + interfaceObject.name + " because it contains no properties or methods");
			return [];
		}

		this.logger.log("Emitting interface", interfaceObject);

		var nodes = new Array<ts.Statement>();
		var modifiers = new Array<ts.Modifier>();

		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		var heritageClauses = new Array<ts.HeritageClause>();
		if (interfaceObject.inheritsFrom && this.typeEmitter.canEmitType(interfaceObject.inheritsFrom, options.inheritedTypeEmitOptions))
			heritageClauses.push(ts.createHeritageClause(
				ts.SyntaxKind.ExtendsKeyword,
				[this.typeEmitter.createTypeScriptExpressionWithTypeArguments(
					interfaceObject.inheritsFrom,
					options.inheritedTypeEmitOptions)]));

		debugger;
		var properties = interfaceObject
			.properties
			.map(x => this
				.propertyEmitter
				.createTypeScriptPropertyNode(x, options.propertyEmitOptions));

		var methods = interfaceObject
			.methods
			.map(x => this
				.methodEmitter
				.createTypeScriptMethodNode(x, options.methodEmitOptions));

		var genericParameters = new Array<ts.TypeParameterDeclaration>();
		if (interfaceObject.genericParameters)
			genericParameters = genericParameters.concat(interfaceObject
				.genericParameters
				.map(x => this
					.typeEmitter
					.createTypeScriptTypeParameterDeclaration(x, options.genericParameterTypeEmitOptions)));

		var members = [...properties, ...methods];
		var node = ts.createInterfaceDeclaration(
			[],
			modifiers,
			options.name || interfaceObject.name,
			genericParameters,
			heritageClauses,
			members);
		nodes.push(node);

		this.logger.log("Done emitting interface", interfaceObject);

		return nodes;
	}
}