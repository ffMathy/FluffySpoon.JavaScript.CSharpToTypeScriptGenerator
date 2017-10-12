import { CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';

import { FileParser, CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface NamespaceEmitOptions {
	declare?: boolean;
	skip?: boolean;
	filter?: (namespace: CSharpNamespace) => boolean;

	classEmitOptions?: ClassEmitOptions;
	interfaceEmitOptions?: InterfaceEmitOptions;
	structEmitOptions?: StructEmitOptions;
	enumEmitOptions?: EnumEmitOptions;
}

export class NamespaceEmitter {
	private enumEmitter: EnumEmitter;
	private classEmitter: ClassEmitter;
	private interfaceEmitter: InterfaceEmitter;
	private structEmitter: StructEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.enumEmitter = new EnumEmitter(stringEmitter, logger);
		this.classEmitter = new ClassEmitter(stringEmitter, logger);
		this.interfaceEmitter = new InterfaceEmitter(stringEmitter, logger);
		this.structEmitter = new StructEmitter(stringEmitter, logger);
	}

	emitNamespaces(namespaces: CSharpNamespace[], options?: NamespaceEmitOptions) {
		this.logger.log("Emitting namespaces", namespaces);

		for (var namespace of namespaces) {
			this.emitNamespace(namespace, options);
		}

		this.logger.log("Done emitting namespaces", namespaces);
	}

	emitNamespace(namespace: CSharpNamespace, options?: NamespaceEmitOptions) {
		var nodes = this.createTypeScriptNamespaceNodes(namespace, options);
		this.stringEmitter.emitTypeScriptNodes(nodes);
	}

	createTypeScriptNamespaceNodes(namespace: CSharpNamespace, options?: NamespaceEmitOptions) {
		options = this.prepareOptions(options);

		if (!options.filter(namespace))
			return [];

		this.logger.log("Emitting namespace", namespace);

		var modifiers = new Array<ts.Modifier>();
		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		var content = new Array<ts.Statement>();

		for (let classObject of namespace.classes) {
			let classNodes = this.classEmitter.createTypeScriptClassNodes(
				classObject,
				Object.assign(
					{ declare: options.skip },
					options.classEmitOptions));
			for (let classNode of classNodes) {
				content.push(classNode);
			}
		}

		for (let namespaceObject of namespace.namespaces) {
			let namespaceNodes = this.createTypeScriptNamespaceNodes(
				namespaceObject,
				Object.assign(
					{ declare: options.skip },
					Object.assign({}, options)));
			for (let namespaceNode of namespaceNodes) {
				content.push(namespaceNode);
			}
		}

		for (let enumObject of namespace.enums) {
			content.push(
				this.enumEmitter.createTypeScriptEnumNode(
				  enumObject,
				  Object.assign(
					  { declare: options.skip },
					  options.enumEmitOptions)));
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

	private prepareOptions(options?: NamespaceEmitOptions) {
		if (!options) {
			options = {};
		}

		if (!options.filter) {
			options.filter = (namespace) => true;
		}

		return options;
	}
}
