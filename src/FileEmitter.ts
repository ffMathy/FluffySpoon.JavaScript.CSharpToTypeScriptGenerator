import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter } from './EnumEmitter';
import { ClassEmitter } from './ClassEmitter';

export class FileEmitter {
    private fileParser: FileParser;
    private stringEmitter: StringEmitter;
    private enumEmitter: EnumEmitter;
    private classEmitter: ClassEmitter;

    constructor(content: string) {
        this.fileParser = new FileParser(content);
        this.stringEmitter = new StringEmitter();

        this.enumEmitter = new EnumEmitter(this.stringEmitter);
        this.classEmitter = new ClassEmitter(this.stringEmitter);
    }

    emitFile() {
        var file = this.fileParser.parseFile();
        this.enumEmitter.emitEnums(file.enums);
        this.classEmitter.emitClasses(file.classes);
        
        this.stringEmitter.removeLastCharacters("\n\n");

        return this.stringEmitter.output;
    }
}