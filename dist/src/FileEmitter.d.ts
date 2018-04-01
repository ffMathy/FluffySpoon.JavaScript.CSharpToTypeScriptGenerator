import { CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
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
    onAfterParse?: (file: CSharpFile) => void;
    onBeforeEmit?: (file: CSharpFile, typeScriptEmitter: TypeScriptEmitter) => void;
}
export declare class FileEmitter {
    private logger;
    private typeScriptEmitter;
    private fileParser;
    private enumEmitter;
    private classEmitter;
    private interfaceEmitter;
    private namespaceEmitter;
    private structEmitter;
    constructor(logger: Logger, typeScriptEmitter: TypeScriptEmitter, content: string);
    emitFile(options?: FileEmitOptions): string;
}
