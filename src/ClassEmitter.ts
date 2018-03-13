import { FileParser, CSharpClass, CSharpNamespace, CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';

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
}

export interface ClassEmitOptionsLinks {
	enumEmitOptions?: EnumEmitOptions;
	propertyEmitOptions?: PropertyEmitOptions;
	interfaceEmitOptions?: InterfaceEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	fieldEmitOptions?: FieldEmitOptions;
	structEmitOptions?: StructEmitOptions;
	genericParameterTypeEmitOptions?: TypeEmitOptions;
	inheritedTypeEmitOptions?: TypeEmitOptions;
}

export interface ClassEmitOptions extends ClassEmitOptionsBase, ClassEmitOptionsLinks {
	perClassEmitOptions?: (classObject: CSharpClass) => PerClassEmitOptions;
}

export interface PerClassEmitOptions extends ClassEmitOptionsBase, ClassEmitOptionsLinks {
	name?: string;
}

export class ClassEmitter {
	private enumEmitter: EnumEmitter;
	private propertyEmitter: PropertyEmitter;
	private fieldEmitter: FieldEmitter;
	private methodEmitter: MethodEmitter;
	private interfaceEmitter: InterfaceEmitter;
	private typeEmitter: TypeEmitter;

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

	emitClasses(classes: CSharpClass[], options: ClassEmitOptions) {
		this.logger.log("Emitting classes", classes);

		for (var classObject of classes) {
			this.emitClass(classObject, options);
		}

		this.logger.log("Done emitting classes", classes);
	}

	emitClass(classObject: CSharpClass, options: ClassEmitOptions) {
		var nodes = this.createTypeScriptClassNodes(classObject, options);
		for (var node of nodes)
			this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptClassNodes(classObject: CSharpClass, options: ClassEmitOptions & PerClassEmitOptions) {
		options = Object.assign(
			options,
			options.perClassEmitOptions(classObject));
			
		if (!options.filter(classObject)) {
			return [];
		}

		var hasNestedChildren = 
			classObject.interfaces.length > 0 || 
			classObject.classes.length > 0 || 
			classObject.structs.length > 0 || 
			classObject.enums.length > 0;

		var hasDirectChildren = 
			classObject.properties.length > 0 || 
			classObject.methods.length > 0 || 
			classObject.fields.length > 0;

		if (!hasDirectChildren && !hasNestedChildren) {
			this.logger.log("Skipping emitting body of class " + classObject.name + " because it contains no children");
			return [];
		}

		this.logger.log("Emitting class", classObject);

		var nodes = new Array<ts.Statement>();

		if(hasDirectChildren) {
			var modifiers = new Array<ts.Modifier>();

			if (options.declare)
				modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

			var heritageClauses = new Array<ts.HeritageClause>();
			if (classObject.inheritsFrom && this.typeEmitter.canEmitType(classObject.inheritsFrom, options.inheritedTypeEmitOptions))
				heritageClauses.push(ts.createHeritageClause(
					ts.SyntaxKind.ExtendsKeyword,
					[this.typeEmitter.createTypeScriptExpressionWithTypeArguments(
						classObject.inheritsFrom,
						options.inheritedTypeEmitOptions)]));

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
			if (classObject.genericParameters)
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

			var classMembers = [...fields, ...properties, ...methods];
			var node = ts.createInterfaceDeclaration(
				[],
				modifiers,
				options.name || classObject.name,
				genericParameters,
				heritageClauses,
				classMembers);
			nodes.push(node);
		}

		if (hasNestedChildren) {
			var wrappedNamespace = new CSharpNamespace(options.name || classObject.name);
			wrappedNamespace.classes = classObject.classes;
			wrappedNamespace.enums = classObject.enums;
			wrappedNamespace.interfaces = classObject.interfaces;
			wrappedNamespace.structs = classObject.structs;

			if(classObject.parent instanceof CSharpFile || classObject.parent instanceof CSharpNamespace)
				wrappedNamespace.parent = classObject.parent;

			classObject.classes = [];
			classObject.enums = [];
			classObject.interfaces = [];
			classObject.structs = [];

			classObject.parent = wrappedNamespace;

			var namespaceEmitter = new NamespaceEmitter(this.stringEmitter, this.logger);
			var falseDeclare = { 
				declare: false
			};
			var namespaceNodes = namespaceEmitter.createTypeScriptNamespaceNodes(
				wrappedNamespace,
				Object.assign(options, {
					classEmitOptions: Object.assign(options, falseDeclare),
					enumEmitOptions: Object.assign(options.enumEmitOptions, falseDeclare),
					interfaceEmitOptions: Object.assign(options.interfaceEmitOptions, falseDeclare),
					structEmitOptions: Object.assign(options.structEmitOptions, falseDeclare),
					skip: false,
					declare: true
				}));
			for (var namespaceNode of namespaceNodes)
				nodes.push(namespaceNode);
		}

		this.logger.log("Done emitting class", classObject);

		return nodes;
	}
}
