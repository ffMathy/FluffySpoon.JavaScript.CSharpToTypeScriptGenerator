import { CSharpMethod, CSharpMethodParameter } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';

export interface MethodEmitOptions {
	returnTypeEmitOptions?: TypeEmitOptions;
	argumentTypeEmitOptions?: TypeEmitOptions;
}

export class MethodEmitter {
	private typeEmitter: TypeEmitter;

	constructor(private stringEmitter: StringEmitter) {
		this.typeEmitter = new TypeEmitter(stringEmitter);
	}

	emitMethods(methods: CSharpMethod[], options?: MethodEmitOptions) {
		options = this.prepareOptions(options);

		for (var method of methods) {
			this.emitMethod(method, options);
		}
	}

	emitMethod(method: CSharpMethod, options?: MethodEmitOptions) {
		options = this.prepareOptions(options);

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