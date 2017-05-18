import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';

export class FileEmitter {
    private fileParser: FileParser;
    private stringEmitter: StringEmitter;

    constructor(content: string) {
        this.fileParser = new FileParser(content);
        this.stringEmitter = new StringEmitter();
    }

    emitFile() {
        var file = this.fileParser.parseFile();
        this.emitEnums(file.enums);

        return this.stringEmitter.output;
    }

    private emitEnums(enums: CSharpEnum[]) {
        for (var enumObject of enums) {
            this.emitEnum(enumObject);
        }
    }

    private emitEnum(enumObject: CSharpEnum) {
        this.stringEmitter.writeLine("declare enum " + enumObject.name + " {");
        this.stringEmitter.increaseIndentation();

        for (var option of enumObject.options) {
            this.emitEnumOption(option);
        }
        this.stringEmitter.removeLastCharacters(',\n');

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    }

    private emitEnumOption(option: CSharpEnumOption) {
        this.stringEmitter.writeLine(option.name + " = " + option.value + ",");
    }
}