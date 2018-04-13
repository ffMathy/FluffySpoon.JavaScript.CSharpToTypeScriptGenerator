import { FileParser, CSharpNamespace, CSharpFile } from '@fluffy-spoon/csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { NestingLevelMixin } from './Emitter';

export interface NamespaceEmitOptionsBase {
	declare?: boolean;
	skip?: boolean;
	filter?: (namespace: CSharpNamespace) => boolean;
}

export interface NamespaceEmitOptionsLinks {
	classEmitOptions?: ClassEmitOptions;
	interfaceEmitOptions?: InterfaceEmitOptions;
	structEmitOptions?: StructEmitOptions;
	enumEmitOptions?: EnumEmitOptions;
}

export interface NamespaceEmitOptions extends NamespaceEmitOptionsBase, NamespaceEmitOptionsLinks {
}

export class NamespaceEmitter {
	private enumEmitter: EnumEmitter;
	private classEmitter: ClassEmitter;
	private interfaceEmitter: InterfaceEmitter;
	private structEmitter: StructEmitter;

	constructor(
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger
	) {
		if(!this.logger) 
			this.logger = new Logger();
		
		this.enumEmitter = new EnumEmitter(typeScriptEmitter, logger);
		this.classEmitter = new ClassEmitter(typeScriptEmitter, logger);
		this.interfaceEmitter = new InterfaceEmitter(typeScriptEmitter, logger);
		this.structEmitter = new StructEmitter(typeScriptEmitter, logger);
	}

	emitNamespaces(namespaces: CSharpNamespace[], options: NamespaceEmitOptions & NestingLevelMixin) {
		this.logger.log("Emitting namespaces", namespaces);

		for (var namespace of namespaces) {
			this.emitNamespace(namespace, options);
		}

		this.logger.log("Done emitting namespaces", namespaces);
	}

	emitNamespace(namespace: CSharpNamespace, options: NamespaceEmitOptions & NestingLevelMixin) {
		var nodes = this.createTypeScriptNamespaceNodes(namespace, options);
		this.typeScriptEmitter.emitTypeScriptNodes(nodes);
	}

	createTypeScriptNamespaceNodes(namespace: CSharpNamespace, options: NamespaceEmitOptions & NestingLevelMixin) {
		if (!options.filter(namespace))
			return [];

		this.logger.log("Emitting namespace", namespace);

		var modifiers = new Array<ts.Modifier>();
		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		var content = new Array<ts.Statement>();

		for (let enumObject of namespace.enums) {
			content.push(
				this.enumEmitter.createTypeScriptEnumNode(
				  	enumObject,
				  	<EnumEmitOptions>{ 
					 	declare: options.skip, 
					  	...options.enumEmitOptions
					}));
		}

		for (let classObject of namespace.classes) {
			let classNodes = this.classEmitter.createTypeScriptClassNodes(
				classObject,
				<ClassEmitOptions & NestingLevelMixin>{ 
					declare: options.skip, 
					...options.classEmitOptions,
					nestingLevel: options.nestingLevel + 1
				});
			for (let classNode of classNodes) {
				content.push(classNode);
			}
		}

		for (let interfaceObject of namespace.interfaces) {
			let interfaceNodes = this.interfaceEmitter.createTypeScriptInterfaceNodes(
				interfaceObject,
				<InterfaceEmitOptions>{ 
					declare: options.skip, 
					...options.interfaceEmitOptions
				});
			for (let interfaceNode of interfaceNodes) {
				content.push(interfaceNode);
			}
		}

		for (let namespaceObject of namespace.namespaces) {
			let namespaceNodes = this.createTypeScriptNamespaceNodes(
				namespaceObject, 
				<NamespaceEmitOptions & NestingLevelMixin>{
					...options, 
					declare: false,
					nestingLevel: options.nestingLevel + 1
				});
			for (let namespaceNode of namespaceNodes) {
				content.push(namespaceNode);
			}
		}

		for (let structObject of namespace.structs) {
			content.push(
				this.structEmitter.createTypeScriptStructNode(
				  structObject,
				  <StructEmitOptions>{ 
					  declare: options.skip,
					  ...options.structEmitOptions
				  }));
		}

		var nodes = new Array<ts.Statement>();
		if (!options.skip) {
			nodes.push(ts.createModuleDeclaration(
				[],
				modifiers,
				ts.createIdentifier(namespace.name),
				ts.createModuleBlock(content),
				ts.NodeFlags.Namespace | ts.NodeFlags.NestedNamespace));
		} else {
			nodes = content;
		}

		this.logger.log("Done emitting namespace", namespace);

		return nodes;
	}
}
