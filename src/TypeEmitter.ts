import { CSharpType } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';

export class TypeEmitter {

    constructor(private stringEmitter: StringEmitter) {

    }

	emitType(type: CSharpType) {
		this.stringEmitter.write(type.name);
		if (type.genericParameters) {
			this.stringEmitter.write("<");
			for (var genericParameter of type.genericParameters) {
				this.emitType(genericParameter);
			}
			this.stringEmitter.removeLastCharacters(", ");
			this.stringEmitter.write(">");
		}
    }

}