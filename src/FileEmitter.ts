import { FileParser, CSharpEnum, CSharpEnumOption, CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitter, NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { NestingLevelMixin } from './Emitter';

export interface FileEmitOptions {
	classEmitOptions?: ClassEmitOptions,
	namespaceEmitOptions?: NamespaceEmitOptions,
	enumEmitOptions?: EnumEmitOptions,
	structEmitOptions?: StructEmitOptions,
	interfaceEmitOptions?: InterfaceEmitOptions,

	onAfterParsing?: (file: CSharpFile, fileEmitter: StringEmitter) => void
}

export class FileEmitter {
	private fileParser: FileParser;
	private enumEmitter: EnumEmitter;
	private classEmitter: ClassEmitter;
	private interfaceEmitter: InterfaceEmitter;
	private namespaceEmitter: NamespaceEmitter;
	private structEmitter: StructEmitter;

	constructor(
		private logger: Logger,
		private stringEmitter: StringEmitter,
		content: string) 
	{
		this.fileParser = new FileParser(content);

		this.enumEmitter = new EnumEmitter(this.stringEmitter, this.logger);
		this.classEmitter = new ClassEmitter(this.stringEmitter, this.logger);
		this.interfaceEmitter = new InterfaceEmitter(this.stringEmitter, this.logger);
		this.namespaceEmitter = new NamespaceEmitter(this.stringEmitter, this.logger);
		this.structEmitter = new StructEmitter(this.stringEmitter, this.logger);
	}

	emitFile(options?: FileEmitOptions) {
		debugger;

		if(!options)
			options = {};

		this.logger.log("Emitting file.");

		var file = this.fileParser.parseFile();
		if (options.onAfterParsing)
			options.onAfterParsing(file, this.stringEmitter);

		var nodes = new Array<ts.Statement>();

		for (let enumObject of file.enums) {
			let enumNode = this.enumEmitter.createTypeScriptEnumNode(
				enumObject,
				{ declare: true, ...options.enumEmitOptions});
			nodes.push(enumNode);
		}

		for (let namespace of file.namespaces) {
			var namespaceNodes = this.namespaceEmitter.createTypeScriptNamespaceNodes(
				namespace,
				<NamespaceEmitOptions & NestingLevelMixin>{ 
					declare: true, 
					nestingLevel: 0, 
					...options.namespaceEmitOptions
				});
			for (var namespaceNode of namespaceNodes)
				nodes.push(namespaceNode);
		}

		for (let interfaceObject of file.interfaces) {
			let interfaceNodes = this.interfaceEmitter.createTypeScriptInterfaceNodes(
				interfaceObject,
				<InterfaceEmitOptions>{ declare: true, ...options.interfaceEmitOptions });
			for (let interfaceNode of interfaceNodes)
				nodes.push(interfaceNode);
		}

		for (let classObject of file.classes) {
			let classNodes = this.classEmitter.createTypeScriptClassNodes(
				classObject,
				<ClassEmitOptions & NestingLevelMixin>{ 
					declare: true, 
					nestingLevel: 0,
					...options.classEmitOptions
				});
			for (let classNode of classNodes)
				nodes.push(classNode);
		}

		for (let structObject of file.structs) {
			let structNode = this.structEmitter.createTypeScriptStructNode(
				structObject,
				<StructEmitOptions>{ declare: true, ...options.structEmitOptions });
			nodes.push(structNode);
		}

		this.stringEmitter.emitTypeScriptNodes(nodes);

		return this.stringEmitter.output;
	}
}
