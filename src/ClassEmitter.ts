import { FileParser, CSharpClass } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter } from './EnumEmitter';
import { PropertyEmitter } from './PropertyEmitter';

declare interface ClassEmitOptions {
    declare: boolean;
}

export class ClassEmitter {
    private enumEmitter: EnumEmitter;
    private propertyEmitter: PropertyEmitter;

    constructor(
        private stringEmitter: StringEmitter)
    {
        this.enumEmitter = new EnumEmitter(stringEmitter);
        this.propertyEmitter = new PropertyEmitter(stringEmitter);
    }

    emitClasses(classes: CSharpClass[], options?: ClassEmitOptions) {
        for (var classObject of classes) {
            this.emitClass(classObject, options);
        }
    }

    emitClass(classObject: CSharpClass, options?: ClassEmitOptions) {
        if (!options) {
            options = {
                declare: true
            }
        }

        this.emitEnumsInClass(classObject, options);
        this.emitClassInterface(classObject, options);
    }

    private emitClassInterface(classObject: CSharpClass, options?: ClassEmitOptions) {
        if (classObject.properties.length === 0) {
            return;
        }

        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");

        this.stringEmitter.write("interface " + classObject.name + " {");
        this.stringEmitter.writeLine();

        this.stringEmitter.increaseIndentation();

        this.propertyEmitter.emitProperties(classObject.properties);

        this.stringEmitter.removeLastCharacters("\n");

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    }

    private emitEnumsInClass(classObject: CSharpClass, options?: ClassEmitOptions) {
        if (classObject.enums.length === 0) {
            return;
        }

        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");

        this.stringEmitter.write("namespace " + classObject.name + " {");
        this.stringEmitter.writeLine();

        this.stringEmitter.increaseIndentation();

        this.enumEmitter.emitEnums(
            classObject.enums,
            {
                declare: false
            });

        this.emitClasses(
            classObject.classes,
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