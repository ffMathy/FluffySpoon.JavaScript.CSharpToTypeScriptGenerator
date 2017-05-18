import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';

export class PropertyEmitter {

    constructor(private stringEmitter: StringEmitter) {

    }

    emitProperties(properties: CSharpProperty[]) {
        for (var property of properties) {
            this.emitProperty(property);
        }
    }

    emitProperty(property: CSharpProperty) {
        this.stringEmitter.writeLine(property.name + ": " + property.type.name + ";");
    }

}