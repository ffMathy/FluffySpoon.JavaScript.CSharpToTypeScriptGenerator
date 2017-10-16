import { CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitOptions } from './StructEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { Logger } from './Logger';
export interface FileEmitOptions {
    classEmitOptions?: ClassEmitOptions;
    namespaceEmitOptions?: NamespaceEmitOptions;
    enumEmitOptions?: EnumEmitOptions;
    structEmitOptions?: StructEmitOptions;
    interfaceEmitOptions?: InterfaceEmitOptions;
    typeEmitOptions?: TypeEmitOptions;
    propertyEmitOptions?: PropertyEmitOptions;
    fieldEmitOptions?: FieldEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
    onAfterParsing?: (file: CSharpFile, fileEmitter: StringEmitter) => void;
}
export declare class FileEmitter {
    readonly stringEmitter: StringEmitter;
    readonly logger: Logger;
    private fileParser;
    private enumEmitter;
    private classEmitter;
    private interfaceEmitter;
    private namespaceEmitter;
    private structEmitter;
    private optionsHelper;
    constructor(content: string);
    emitFile(options?: FileEmitOptions): string;
}
