import { CSharpMethod, CSharpMethodParameter } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter } from './TypeEmitter';

export class MethodEmitter {
	private typeEmitter: TypeEmitter;

	constructor(private stringEmitter: StringEmitter) {
		this.typeEmitter = new TypeEmitter(stringEmitter);
	}

	emitMethods(methods: CSharpMethod[]) {
		for (var method of methods) {
			this.emitMethod(method);
		}
	}

	emitMethod(method: CSharpMethod) {
		this.stringEmitter.writeIndentation();
		this.stringEmitter.write(method.name + "(");
		this.emitMethodParameters(method.parameters);
		this.stringEmitter.write("): ");
		this.typeEmitter.emitType(method.returnType);
		this.stringEmitter.write(";");
		this.stringEmitter.writeLine();
	}

	private emitMethodParameters(parameters: CSharpMethodParameter[]) {
		for (var parameter of parameters) {
			this.emitMethodParameter(parameter);
		}
		this.stringEmitter.removeLastCharacters(", ");
	}

	private emitMethodParameter(parameter: CSharpMethodParameter) {
		this.stringEmitter.write(parameter.name + ": ");
		this.typeEmitter.emitType(parameter.type);
		this.stringEmitter.write(", ");
	}

}