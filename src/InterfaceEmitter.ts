import { FileParser, CSharpClass, CSharpInterface } from '@fluffy-spoon/csharp-parser';

import { TypeScriptEmitter } from './TypeScriptEmitter';
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
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger
	) {
		if(!this.logger) 
			this.logger = new Logger();
		
		this.propertyEmitter = new PropertyEmitter(typeScriptEmitter, logger);
		this.methodEmitter = new MethodEmitter(typeScriptEmitter, logger);
		this.typeEmitter = new TypeEmitter(typeScriptEmitter, logger);
		this.optionsHelper = new OptionsHelper();
	}

	emitInterfaces(interfaces: CSharpInterface[], options: InterfaceEmitOptions) {
		this.logger.log("Emitting interfaces", interfaces);

		for (var interfaceObject of interfaces) {
			this.emitInterface(interfaceObject, options);
		}

		this.typeScriptEmitter.removeLastNewLines();

		this.logger.log("Done emitting interfaces", interfaces);
	}

	emitInterface(interfaceObject: CSharpInterface, options: InterfaceEmitOptions) {
		var nodes = this.createTypeScriptInterfaceNodes(interfaceObject, options);
		for (var node of nodes)
			this.typeScriptEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptInterfaceNodes(interfaceObject: CSharpInterface, options: InterfaceEmitOptions & PerInterfaceEmitOptions) {
		if(options.perInterfaceEmitOptions)
			options = this.optionsHelper.mergeOptionsRecursively<any>(
				options.perInterfaceEmitOptions(interfaceObject), 
				options);

		if (!options.filter(interfaceObject))
			return [];

		if (interfaceObject.properties.length === 0 && interfaceObject.methods.length === 0 && interfaceObject.implements.length === 0) {
			this.logger.log("Skipping emitting body of interface " + interfaceObject.name + " because it contains no properties or methods");
			return [];
		}

		this.logger.log("Emitting interface", interfaceObject);

		var nodes = new Array<ts.Statement>();
		var modifiers = new Array<ts.Modifier>();

		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		var heritageClauses = new Array<ts.HeritageClause>();
		var implementationsToEmit = (interfaceObject.implements || [])
			.filter(x => this.typeEmitter.canEmitType(x, options.inheritedTypeEmitOptions))
		for(var implement of implementationsToEmit)
			heritageClauses.push(ts.createHeritageClause(
				ts.SyntaxKind.ExtendsKeyword,
				[this.typeEmitter.createTypeScriptExpressionWithTypeArguments(
					implement,
					options.inheritedTypeEmitOptions)]));

		var properties = interfaceObject
			.properties
			.map(x => this
				.propertyEmitter
				.createTypeScriptPropertyNode(x, options.propertyEmitOptions))
			.filter(x => !!x);

		var methods = interfaceObject
			.methods
			.map(x => this
				.methodEmitter
				.createTypeScriptMethodNode(x, options.methodEmitOptions))
			.filter(x => !!x);

		var genericParameters = new Array<ts.TypeParameterDeclaration>();
		if (interfaceObject.isGeneric)
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
