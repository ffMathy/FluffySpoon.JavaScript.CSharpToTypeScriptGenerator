import { FileParser, CSharpClass } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter } from './EnumEmitter';

export class ClassEmitter {
    private enumEmitter: EnumEmitter;

    constructor(
        private stringEmitter: StringEmitter)
    {
        this.enumEmitter = new EnumEmitter(stringEmitter);
    }

    emitClasses(classes: CSharpClass[]) {
        for (var classObject of classes) {
            this.emitClass(classObject);
        }
    }

    emitClass(classObject: CSharpClass) {
        this.stringEmitter.writeLine("declare namespace " + classObject.fullName + " {");
        this.stringEmitter.increaseIndentation();

        this.enumEmitter.emitEnums(
            classObject.enums,
            {
                declare: false
            });

        this.stringEmitter.removeLastCharacters("\n\n");

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    }
}