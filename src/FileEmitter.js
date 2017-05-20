import { FileParser } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter } from './EnumEmitter';
import { ClassEmitter } from './ClassEmitter';
import { NamespaceEmitter } from './NamespaceEmitter';
export class FileEmitter {
    constructor(content) {
        this.fileParser = new FileParser(content);
        this.stringEmitter = new StringEmitter();
        this.enumEmitter = new EnumEmitter(this.stringEmitter);
        this.classEmitter = new ClassEmitter(this.stringEmitter);
        this.namespaceEmitter = new NamespaceEmitter(this.stringEmitter);
    }
    emitFile(options) {
        var file = this.fileParser.parseFile();
        this.enumEmitter.emitEnums(file.enums);
        this.namespaceEmitter.emitNamespaces(file.namespaces, options.namespaceEmitOptions);
        this.classEmitter.emitClasses(file.classes, options.classEmitOptions);
        this.stringEmitter.removeLastCharacters("\n\n");
        return this.stringEmitter.output;
    }
}
