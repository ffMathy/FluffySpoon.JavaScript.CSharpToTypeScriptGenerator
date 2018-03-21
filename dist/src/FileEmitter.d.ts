import { CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { StructEmitOptions } from './StructEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitOptions } from './NamespaceEmitter';
import { Logger } from './Logger';
export interface FileEmitOptions {
    classEmitOptions?: ClassEmitOptions;
    namespaceEmitOptions?: NamespaceEmitOptions;
    enumEmitOptions?: EnumEmitOptions;
    structEmitOptions?: StructEmitOptions;
    interfaceEmitOptions?: InterfaceEmitOptions;
    onAfterParsing?: (file: CSharpFile, fileEmitter: StringEmitter) => void;
}
export declare class FileEmitter {
    private logger;
    private stringEmitter;
    private fileParser;
    private enumEmitter;
    private classEmitter;
    private interfaceEmitter;
    private namespaceEmitter;
    private structEmitter;
    constructor(logger: Logger, stringEmitter: StringEmitter, content: string);
    emitFile(options?: FileEmitOptions): string;
}
