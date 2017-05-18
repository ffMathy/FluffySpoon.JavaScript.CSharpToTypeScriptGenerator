import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';

declare interface EnumEmitOptions {
    declare: boolean;
}

export class EnumEmitter {
    constructor(
        private stringEmitter: StringEmitter) {

    }

    emitEnums(enums: CSharpEnum[], options?: EnumEmitOptions) {
        for (var enumObject of enums) {
            this.emitEnum(enumObject, options);
        }
    }

    emitEnum(enumObject: CSharpEnum, options?: EnumEmitOptions) {
        if (!options) {
            options = {
                declare: true
            }
        }

        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");

        this.stringEmitter.write("enum " + enumObject.name + " {");
        this.stringEmitter.writeLine();

        this.stringEmitter.increaseIndentation();

        for (var option of enumObject.options)
            this.emitEnumOption(option);

        this.stringEmitter.removeLastCharacters(',\n');

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    }

    emitEnumOption(option: CSharpEnumOption) {
        this.stringEmitter.writeLine(option.name + " = " + option.value + ",");
    }
}