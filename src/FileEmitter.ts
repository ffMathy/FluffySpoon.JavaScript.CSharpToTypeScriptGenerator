import { FileParser, CSharpEnum, CSharpEnumOption, CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { OptionsHelper } from './options/OptionsHelper';
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

export interface FileEmitOptions {
	classEmitOptions?: ClassEmitOptions,
	namespaceEmitOptions?: NamespaceEmitOptions,
	enumEmitOptions?: EnumEmitOptions,
	structEmitOptions?: StructEmitOptions,
	interfaceEmitOptions?: InterfaceEmitOptions,
	typeEmitOptions?: TypeEmitOptions,
	propertyEmitOptions?: PropertyEmitOptions,
	fieldEmitOptions?: FieldEmitOptions,
	methodEmitOptions?: MethodEmitOptions,

	onAfterParsing?: (file: CSharpFile, fileEmitter: StringEmitter) => void
}

export class FileEmitter {
	public readonly stringEmitter: StringEmitter;
	public readonly logger: Logger;

	private fileParser: FileParser;
	private enumEmitter: EnumEmitter;
	private classEmitter: ClassEmitter;
	private interfaceEmitter: InterfaceEmitter;
	private namespaceEmitter: NamespaceEmitter;
	private structEmitter: StructEmitter;
	private optionsHelper: OptionsHelper;

	constructor(content: string) {
		this.fileParser = new FileParser(content);

		this.logger = new Logger();

		this.stringEmitter = new StringEmitter(this.logger);

		this.enumEmitter = new EnumEmitter(this.stringEmitter, this.logger);
		this.classEmitter = new ClassEmitter(this.stringEmitter, this.logger);
		this.interfaceEmitter = new InterfaceEmitter(this.stringEmitter, this.logger);
		this.namespaceEmitter = new NamespaceEmitter(this.stringEmitter, this.logger);
		this.structEmitter = new StructEmitter(this.stringEmitter, this.logger);
	}

	emitFile(options?: FileEmitOptions) {
		if(!options)
			options = {};

		this.logger.log("Emitting file.");
		
		options = OptionsHelper.prepareFileEmitOptionDefaults(options);
		options = OptionsHelper.prepareFileEmitOptionInheritance(options);

		var file = this.fileParser.parseFile();
		if (options.onAfterParsing)
			options.onAfterParsing(file, this.stringEmitter);

		var nodes = new Array<ts.Statement>();

		for (let enumObject of file.enums) {
			let enumNode = this.enumEmitter.createTypeScriptEnumNode(
				enumObject,
				Object.assign(
					{ declare: true },
					options.enumEmitOptions));
			nodes.push(enumNode);
		}

		for (let namespace of file.namespaces) {
			var namespaceNodes = this.namespaceEmitter.createTypeScriptNamespaceNodes(
				namespace,
				Object.assign(
					{ declare: true },
					options.namespaceEmitOptions));
			for (var namespaceNode of namespaceNodes)
				nodes.push(namespaceNode);
		}

		for (let interfaceObject of file.interfaces) {
			let interfaceNodes = this.interfaceEmitter.createTypeScriptInterfaceNodes(
				interfaceObject,
				Object.assign(
					{ declare: true },
					options.classEmitOptions));
			for (let interfaceNode of interfaceNodes)
				nodes.push(interfaceNode);
		}

		for (let classObject of file.classes) {
			let classNodes = this.classEmitter.createTypeScriptClassNodes(
				classObject,
				Object.assign(
					{ declare: true },
					options.classEmitOptions));
			for (let classNode of classNodes)
				nodes.push(classNode);
		}

		for (let structObject of file.structs) {
			let structNode = this.structEmitter.createTypeScriptStructNode(
				structObject,
				Object.assign(
					{ declare: true },
					options.structEmitOptions));
			nodes.push(structNode);
		}

		/*if (file.enums.length > 0) {
			this.enumEmitter.emitEnums(file.enums, Object.assign({ declare: true }, options.enumEmitOptions));
			this.stringEmitter.ensureNewParagraph();
		}

		if (file.namespaces.length > 0) {
			this.namespaceEmitter.emitNamespaces(
				file.namespaces, 
				Object.assign({ declare: true }, options.namespaceEmitOptions));
			this.stringEmitter.ensureNewParagraph();
		}

		if (file.interfaces.length > 0) {
			this.interfaceEmitter.emitInterfaces(
				file.interfaces, 
				Object.assign({ declare: true }, options.interfaceEmitOptions));
			this.stringEmitter.ensureNewParagraph();
        }

		if (file.classes.length > 0) {
			this.classEmitter.emitClasses(
				file.classes, 
				Object.assign({ declare: true }, options.classEmitOptions));
			this.stringEmitter.ensureNewParagraph();
        }

        if (file.structs.length > 0) {
            this.structEmitter.emitStructs(
				file.structs, 
				Object.assign({ declare: true }, options.structEmitOptions));
            this.stringEmitter.ensureNewParagraph();
		}*/

		this.stringEmitter.emitTypeScriptNodes(nodes);

		return this.stringEmitter.output;
	}
}
