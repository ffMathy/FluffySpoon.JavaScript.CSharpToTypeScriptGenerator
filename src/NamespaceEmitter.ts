import { FileParser, CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';

export interface NamespaceEmitOptions {
	declare?: boolean;
	skip?: boolean;

	classEmitOptions?: ClassEmitOptions;
	enumEmitOptions?: EnumEmitOptions;
}

export class NamespaceEmitter {
	private enumEmitter: EnumEmitter;
	private classEmitter: ClassEmitter;

	constructor(
		private stringEmitter: StringEmitter) {
		this.enumEmitter = new EnumEmitter(stringEmitter);
		this.classEmitter = new ClassEmitter(stringEmitter);
	}

	emitNamespaces(namespaces: CSharpNamespace[], options?: NamespaceEmitOptions) {
		for (var namespace of namespaces) {
			this.emitNamespace(namespace, options);
		}
	}

	emitNamespace(namespace: CSharpNamespace, options?: NamespaceEmitOptions) {
		if (!options) {
			options = {
				declare: true
			}
		}

		if (namespace.enums.length === 0 && namespace.namespaces.length === 0 && namespace.classes.length === 0) {
			console.log("Skipping namespace " + namespace.name + " because it contains no enums, classes or namespaces");
			return;
		}

		if (!options.skip) {
			this.stringEmitter.writeIndentation();
			if (options.declare)
				this.stringEmitter.write("declare ");

			this.stringEmitter.write("namespace " + namespace.name + " {");
			this.stringEmitter.writeLine();

			this.stringEmitter.increaseIndentation();
		}

		if (namespace.enums.length > 0) {
			var namespaceEnumOptions = Object.assign(options.enumEmitOptions || {}, <EnumEmitOptions>{
				declare: options.skip
			});
			this.enumEmitter.emitEnums(
				namespace.enums,
				namespaceEnumOptions);
			this.stringEmitter.writeLine();
		}

		if (namespace.classes.length > 0) {
			this.classEmitter.emitClasses(
				namespace.classes,
				options.classEmitOptions);
			this.stringEmitter.writeLine();
		}

		if (namespace.namespaces.length > 0) {
			var subNamespaceOptions = Object.assign(options, <NamespaceEmitOptions>{
				declare: options.skip
			});
			this.emitNamespaces(
				namespace.namespaces,
				subNamespaceOptions);
			this.stringEmitter.writeLine();
		}

		this.stringEmitter.removeLastCharacters("\n");

		if (!options.skip) {
			this.stringEmitter.removeLastCharacters("\n");

			this.stringEmitter.decreaseIndentation();

			this.stringEmitter.writeLine();
			this.stringEmitter.writeLine("}");
			this.stringEmitter.writeLine();
		}
	}
}