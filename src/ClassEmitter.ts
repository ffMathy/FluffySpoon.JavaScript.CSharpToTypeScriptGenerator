import { FileParser, CSharpClass, CSharpNamespace, CSharpFile } from '@fluffy-spoon/csharp-parser';

import { TypeScriptEmitter } from './TypeScriptEmitter';
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
import { NestingLevelMixin } from './Emitter';
import { OptionsHelper } from './OptionsHelper';

export interface ClassEmitOptionsBase {
	declare?: boolean;
	filter?: (classObject: CSharpClass) => boolean;
	perClassEmitOptions?: (classObject: CSharpClass) => PerClassEmitOptions;
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
	private optionsHelper: OptionsHelper;

	constructor(
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger
	) {
		if(!this.logger) 
			this.logger = new Logger();

		this.enumEmitter = new EnumEmitter(typeScriptEmitter, logger);
		this.propertyEmitter = new PropertyEmitter(typeScriptEmitter, logger);
		this.fieldEmitter = new FieldEmitter(typeScriptEmitter, logger);
		this.methodEmitter = new MethodEmitter(typeScriptEmitter, logger);
		this.typeEmitter = new TypeEmitter(typeScriptEmitter, logger);
		this.interfaceEmitter = new InterfaceEmitter(typeScriptEmitter, logger);
		this.optionsHelper = new OptionsHelper();
	}

	emitClasses(classes: CSharpClass[], options: ClassEmitOptions & NestingLevelMixin) {
		this.logger.log("Emitting classes", classes);

		for (var classObject of classes) {
			this.emitClass(classObject, options);
		}

		this.logger.log("Done emitting classes", classes);
	}

	emitClass(classObject: CSharpClass, options: ClassEmitOptions & NestingLevelMixin) {
		var nodes = this.createTypeScriptClassNodes(classObject, options);
		for (var node of nodes)
			this.typeScriptEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptClassNodes(classObject: CSharpClass, options: ClassEmitOptions & PerClassEmitOptions & NestingLevelMixin) {
		if(options.perClassEmitOptions)
			options = this.optionsHelper.mergeOptionsRecursively<any>(
				options.perClassEmitOptions(classObject), 
				options);
		
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
			classObject.fields.length > 0 ||
			classObject.inheritsFrom.length > 0;

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
			var inheritancesToEmit = (classObject.inheritsFrom || [])
				.filter(x => this.typeEmitter.canEmitType(x, options.inheritedTypeEmitOptions))

			var inheritedTypes = new Array<ts.ExpressionWithTypeArguments>();
            for (var inheritsFrom of inheritancesToEmit) 
                inheritedTypes.push(this.typeEmitter.createTypeScriptExpressionWithTypeArguments(inheritsFrom, options.inheritedTypeEmitOptions));
            if (inheritancesToEmit.length > 0) 
                heritageClauses.push(ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, inheritedTypes));

			var properties = classObject
				.properties
				.map(x => this
					.propertyEmitter
					.createTypeScriptPropertyNode(x, options.propertyEmitOptions))
				.filter(x => !!x);
					
			var methods = classObject
				.methods
				.map(x => this
					.methodEmitter
					.createTypeScriptMethodNode(x, options.methodEmitOptions))
				.filter(x => !!x);

			var genericParameters = new Array<ts.TypeParameterDeclaration>();
			if (classObject.isGeneric)
				genericParameters = genericParameters.concat(classObject
					.genericParameters
					.map(x => this
						.typeEmitter
						.createTypeScriptTypeParameterDeclaration(x, options.genericParameterTypeEmitOptions)));

			var fields = classObject
				.fields
				.map(x => this
					.fieldEmitter
					.createTypeScriptFieldNode(x, options.fieldEmitOptions))
				.filter(x => !!x);

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

			var namespaceEmitter = new NamespaceEmitter(this.typeScriptEmitter, this.logger);

			var declareObject = { 
				declare: false
			};
			var namespaceOptions = <NamespaceEmitOptions & NestingLevelMixin>{
				classEmitOptions: <ClassEmitOptions & NestingLevelMixin>{
					...options, 
					declare: false,
					nestingLevel: options.nestingLevel + 1
				},
				enumEmitOptions: {...options.enumEmitOptions, declare: false},
				interfaceEmitOptions: {...options.interfaceEmitOptions, declare: false},
				structEmitOptions: {...options.structEmitOptions, declare: false},
				filter: () => true,
				skip: false,
				declare: options.nestingLevel === 0 ? options.declare : false,
				nestingLevel: options.nestingLevel,
			};

			var namespaceNodes = namespaceEmitter.createTypeScriptNamespaceNodes(
				wrappedNamespace,
				namespaceOptions);
			for (var namespaceNode of namespaceNodes)
				nodes.push(namespaceNode);
		}

		this.logger.log("Done emitting class", classObject);

		return nodes;
	}
}
