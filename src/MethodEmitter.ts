import { CSharpMethod, CSharpMethodParameter } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

export interface MethodEmitOptions {
	filter?: (method: CSharpMethod) => boolean;

	returnTypeEmitOptions?: TypeEmitOptions;
	argumentTypeEmitOptions?: TypeEmitOptions;
}

export class MethodEmitter {
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitMethods(methods: CSharpMethod[], options?: MethodEmitOptions) {
		options = this.prepareOptions(options);

		for (var method of methods) {
			this.emitMethod(method, options);
		}
	}

	emitMethod(method: CSharpMethod, options?: MethodEmitOptions) {
		options = this.prepareOptions(options);

		if (!options.filter(method))
			return;

		if (method.isConstructor)
			return;

		this.stringEmitter.writeIndentation();
		this.stringEmitter.write(method.name + "(");
		this.emitMethodParameters(method.parameters, options);
		this.stringEmitter.write("): ");
		this.typeEmitter.emitType(method.returnType, options.returnTypeEmitOptions);
		this.stringEmitter.write(";");
		this.stringEmitter.writeLine();
	}

	private prepareOptions(options?: MethodEmitOptions) {
		if (!options) {
			options = {}
		}

		if (!options.filter) {
			options.filter = () => true;
		}

		return options;
	}

	private emitMethodParameters(parameters: CSharpMethodParameter[], options: MethodEmitOptions) {
		for (var parameter of parameters) {
			this.emitMethodParameter(parameter, options);
		}
		this.stringEmitter.removeLastCharacters(", ");
	}

	private emitMethodParameter(parameter: CSharpMethodParameter, options: MethodEmitOptions) {
		this.stringEmitter.write(parameter.name + ": ");
		this.typeEmitter.emitType(parameter.type, options.argumentTypeEmitOptions);
		this.stringEmitter.write(", ");
	}

}