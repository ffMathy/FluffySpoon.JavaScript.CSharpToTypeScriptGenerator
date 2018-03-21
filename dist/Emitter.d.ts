import { CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptionsBase } from './TypeEmitter';
import { StructEmitOptionsBase } from './StructEmitter';
import { FileEmitOptions } from './FileEmitter';
import { EnumEmitOptionsBase } from './EnumEmitter';
import { ClassEmitOptionsBase } from './ClassEmitter';
import { InterfaceEmitOptionsBase } from './InterfaceEmitter';
import { NamespaceEmitOptionsBase } from './NamespaceEmitter';
import { MethodEmitOptionsBase } from './MethodEmitter';
import { PropertyEmitOptionsBase } from './PropertyEmitter';
import { FieldEmitOptionsBase } from './FieldEmitter';
import { Logger } from './Logger';
export interface DefaultEmitOptions {
    classEmitOptions?: ClassEmitOptionsBase;
    namespaceEmitOptions?: NamespaceEmitOptionsBase;
    enumEmitOptions?: EnumEmitOptionsBase;
    structEmitOptions?: StructEmitOptionsBase;
    interfaceEmitOptions?: InterfaceEmitOptionsBase;
    typeEmitOptions?: TypeEmitOptionsBase;
    propertyEmitOptions?: PropertyEmitOptionsBase;
    fieldEmitOptions?: FieldEmitOptionsBase;
    methodEmitOptions?: MethodEmitOptionsBase;
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
