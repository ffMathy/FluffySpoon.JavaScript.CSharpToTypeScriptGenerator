import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter } from './TypeEmitter';

export class PropertyEmitter {
	private typeEmitter: TypeEmitter;

	constructor(private stringEmitter: StringEmitter) {
		this.typeEmitter = new TypeEmitter(stringEmitter);
    }

    emitProperties(properties: CSharpProperty[]) {
        for (var property of properties) {
            this.emitProperty(property);
        }
    }

	emitProperty(property: CSharpProperty) {
		this.stringEmitter.writeIndentation();
		this.stringEmitter.write(property.name + ": ");
		this.typeEmitter.emitType(property.type);
		this.stringEmitter.write(";");
		this.stringEmitter.writeLine();
    }

}