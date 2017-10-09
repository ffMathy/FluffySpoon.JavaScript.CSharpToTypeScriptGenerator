import { FileParser, CSharpClass, CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitter, PropertyEmitOptions } from './PropertyEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { FieldEmitter, FieldEmitOptions } from './FieldEmitter';
import { MethodEmitter, MethodEmitOptions } from './MethodEmitter';
import { NamespaceEmitter, NamespaceEmitOptions } from './NamespaceEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface ClassEmitOptionsBase {
	declare?: boolean;
	filter?: (classObject: CSharpClass) => boolean;

	enumEmitOptions?: EnumEmitOptions;
	propertyEmitOptions?: PropertyEmitOptions;
	interfaceEmitOptions?: InterfaceEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	fieldEmitOptions?: FieldEmitOptions;
	structEmitOptions?: StructEmitOptions;
	genericParameterTypeEmitOptions?: TypeEmitOptions;
	inheritedTypeEmitOptions?: TypeEmitOptions;
}

export interface ClassEmitOptions extends ClassEmitOptionsBase {
	perClassEmitOptions?: (classObject: CSharpClass) => PerClassEmitOptions;
}

export interface PerClassEmitOptions extends ClassEmitOptionsBase {
	name?: string;
}

export class ClassEmitter {
	private enumEmitter: EnumEmitter;
	private propertyEmitter: PropertyEmitter;
	private fieldEmitter: FieldEmitter;
	private methodEmitter: MethodEmitter;
	private interfaceEmitter: InterfaceEmitter;
	private typeEmitter: TypeEmitter;
	private namespaceEmitter: NamespaceEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.enumEmitter = new EnumEmitter(stringEmitter, logger);
		this.propertyEmitter = new PropertyEmitter(stringEmitter, logger);
		this.fieldEmitter = new FieldEmitter(stringEmitter, logger);
		this.methodEmitter = new MethodEmitter(stringEmitter, logger);
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
		this.interfaceEmitter = new InterfaceEmitter(stringEmitter, logger);
	}

	emitClasses(classes: CSharpClass[], options?: ClassEmitOptions) {
		this.logger.log("Emitting classes", classes);

		for (var classObject of classes) {
			this.emitClass(classObject, options);
		}

		this.stringEmitter.removeLastNewLines();

		this.logger.log("Done emitting classes", classes);
	}

	emitClass(classObject: CSharpClass, options?: ClassEmitOptions) {
		var nodes = this.createTypeScriptClassNodes(classObject, options);
		if(!nodes)
			return;

		for(var node of nodes)
			this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptClassNodes(classObject: CSharpClass, options?: ClassEmitOptions&PerClassEmitOptions) {
		options = this.prepareOptions(options);
		options = Object.assign(
			options,
			options.perClassEmitOptions(classObject));

		if (!options.filter(classObject))
			return null;

		if (classObject.properties.length === 0 && classObject.methods.length === 0 && classObject.fields.length === 0) {
			this.logger.log("Skipping emitting body of class " + classObject.name + " because it contains no properties, fields or methods");
			return null;
		}
			
		this.logger.log("Emitting class", classObject);

		var nodes = new Array<ts.Node>();
		var modifiers = new Array<ts.Modifier>();

		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		var heritageClause: ts.HeritageClause;
		if(classObject.inheritsFrom && this.typeEmitter.canEmitType(classObject.inheritsFrom)) 
			heritageClause = ts.createHeritageClause(
				ts.SyntaxKind.ImplementsKeyword,
				[this.typeEmitter.createTypeScriptExpressionWithTypeArguments(
					classObject.inheritsFrom,
					options.inheritedTypeEmitOptions)]);

		var properties = classObject
			.properties
			.map(x => this
				.propertyEmitter
				.createTypeScriptPropertyNode(x, options.propertyEmitOptions));

		var methods = classObject
			.methods
			.map(x => this
				.methodEmitter
				.createTypeScriptMethodNode(x, options.methodEmitOptions));

		var genericParameters = new Array<ts.TypeParameterDeclaration>();
		if(classObject.genericParameters)
			genericParameters = genericParameters.concat(classObject
				.genericParameters
				.map(x => this
					.typeEmitter
					.createTypeScriptTypeParameterDeclaration(x, options.genericParameterTypeEmitOptions)));

		var fields = classObject
			.fields
			.map(x => this
				.fieldEmitter
				.createTypeScriptFieldNode(x, options.fieldEmitOptions));

		var classMembers = [...methods, ...properties, ...fields];

		var node = ts.createInterfaceDeclaration(
			[],
			modifiers,
			options.name || classObject.name,
			genericParameters,
			[heritageClause],
			classMembers);
		nodes.push(node);

		if(classObject.classes.length > 0 || 
			classObject.interfaces.length > 0 || 
			classObject.enums.length > 0 ||
			classObject.structs.length > 0) {

			var wrappedNamespace = new CSharpNamespace(options.name || classObject.name);
			wrappedNamespace.classes = classObject.classes;
			wrappedNamespace.enums = classObject.enums;
			wrappedNamespace.interfaces = classObject.interfaces;
			wrappedNamespace.structs = classObject.structs;

			classObject.classes = [];
			classObject.enums = [];
			classObject.interfaces = [];
			classObject.structs = [];

			nodes.push(this.namespaceEmitter.createTypeScriptNamespaceNode(
				wrappedNamespace,
				{
					classEmitOptions: options,
					declare: options.declare,
					enumEmitOptions: options.enumEmitOptions,
					interfaceEmitOptions: options.interfaceEmitOptions,
					structEmitOptions: options.structEmitOptions,
					skip: false
				}));
		}

		this.logger.log("Done emitting class", classObject);

		return nodes;
	}

	private prepareOptions(options?: ClassEmitOptions) {
		if (!options) {
			options = {}
		}

		if (!options.filter) {
			options.filter = (classObject) => classObject.isPublic;
		}

		if (!options.perClassEmitOptions) {
			options.perClassEmitOptions = () => <PerClassEmitOptions>{};
		}

		return options;
	}
}