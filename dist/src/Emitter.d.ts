import { CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitOptions } from './StructEmitter';
import { FileEmitOptions } from './FileEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { Logger } from './Logger';
export interface DefaultEmitOptions {
    classEmitOptions?: ClassEmitOptions;
    namespaceEmitOptions?: NamespaceEmitOptions;
    enumEmitOptions?: EnumEmitOptions;
    structEmitOptions?: StructEmitOptions;
    interfaceEmitOptions?: InterfaceEmitOptions;
    typeEmitOptions?: TypeEmitOptions;
    propertyEmitOptions?: PropertyEmitOptions;
    fieldEmitOptions?: FieldEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
}
export interface EmitOptions {
    defaults?: DefaultEmitOptions;
    file?: FileEmitOptions;
    onAfterParsing?: (file: CSharpFile, fileEmitter: StringEmitter) => void;
}
export declare class Emitter {
    readonly stringEmitter: StringEmitter;
    readonly logger: Logger;
    private fileEmitter;
    constructor(content: string);
    emit(options?: EmitOptions): string;
    private mergeFileEmitOptions(fromSettings, toSettings, defaultSettings);
    private mergeClassEmitOptions(fromSettings, toSettings, defaultSettings);
    private mergeMethodEmitOptions(fromSettings, toSettings, defaultSettings);
    private mergeOptions<T>(fromSettings, toSettings, defaultSettings);
    private prepareEnumEmitOptionDefaults(options);
    private prepareTypeEmitOptionDefaults(options);
    private prepareFieldEmitOptionDefaults(options);
    private preparePropertyEmitOptionDefaults(options);
    private prepareStructEmitOptionDefaults(options);
    private prepareMethodEmitOptionDefaults(options);
    private prepareInterfaceEmitOptionDefaults(options);
    private prepareNamespaceEmitOptionDefaults(options);
    private prepareClassEmitOptionDefaults(options);
    private prepareEmitOptionDefaults(options);
}
