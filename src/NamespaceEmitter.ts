import { FileParser, CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';

export interface NamespaceEmitOptions {
	declare?: boolean;
	skip?: boolean;

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

		this.stringEmitter.removeLastNewLines();

		this.logger.log("Done emitting namespaces", namespaces);
	}

	emitNamespace(namespace: CSharpNamespace, options?: NamespaceEmitOptions) {
		if (!options) {
			options = {
				declare: true
			}
		}

		if (namespace.enums.length === 0 && namespace.namespaces.length === 0 && namespace.classes.length === 0 && namespace.interfaces.length === 0) {
			console.log("Skipping namespace " + namespace.name + " because it contains no enums, classes, interfaces or namespaces");
			return;
		}

		this.logger.log("Emitting namespace", namespace);

		if (!options.skip) {
			this.stringEmitter.writeIndentation();
			if (options.declare)
				this.stringEmitter.write("declare ");

			this.stringEmitter.write("namespace " + namespace.name + " {");
			this.stringEmitter.writeLine();

			this.stringEmitter.increaseIndentation();
		}

		if (namespace.enums.length > 0) {
			var declare = typeof options.interfaceEmitOptions.declare !== "undefined" ? 
				options.interfaceEmitOptions.declare : 
				options.skip;
			var namespaceEnumOptions = Object.assign(options.enumEmitOptions || {}, <EnumEmitOptions>{
				declare
			});
			this.enumEmitter.emitEnums(
				namespace.enums,
				namespaceEnumOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (namespace.interfaces.length > 0) {
			var declare = typeof options.interfaceEmitOptions.declare !== "undefined" ? 
				options.interfaceEmitOptions.declare : 
				options.skip;
			var interfaceOptions = Object.assign(options.interfaceEmitOptions, <InterfaceEmitOptions>{
				declare
			});
			this.interfaceEmitter.emitInterfaces(
				namespace.interfaces,
				interfaceOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (namespace.classes.length > 0) {
			var declare = typeof options.classEmitOptions.declare !== "undefined" ? 
				options.classEmitOptions.declare : 
				options.skip;
			var classOptions = Object.assign(options.classEmitOptions, <ClassEmitOptions>{
				declare
			});
			this.classEmitter.emitClasses(
				namespace.classes,
				classOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (namespace.structs.length > 0) {
			var declare = typeof options.structEmitOptions.declare !== "undefined" ? 
				options.structEmitOptions.declare : 
				options.skip;
			var structEmitOptions = Object.assign(options.structEmitOptions, <StructEmitOptions>{
				declare
			});
			this.structEmitter.emitStructs(
				namespace.structs,
				structEmitOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (namespace.namespaces.length > 0) {
			var declare = typeof options.declare !== "undefined" ? 
				options.declare : 
				options.skip;
			var subNamespaceOptions = Object.assign(options, <NamespaceEmitOptions>{
				declare
			});
			this.emitNamespaces(
				namespace.namespaces,
				subNamespaceOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (!options.skip) {
			this.stringEmitter.removeLastNewLines();

			this.stringEmitter.decreaseIndentation();

			this.stringEmitter.writeLine();
			this.stringEmitter.writeLine("}");
		}

		this.stringEmitter.ensureNewParagraph();

		this.logger.log("Done emitting namespace", namespace);
	}
}