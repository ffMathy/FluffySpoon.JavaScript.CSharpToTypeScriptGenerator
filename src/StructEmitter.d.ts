import { CSharpStruct } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';
export interface StructEmitOptionsBase {
    declare?: boolean;
    filter?: (struct: CSharpStruct) => boolean;
    propertyEmitOptions?: PropertyEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
    fieldEmitOptions?: FieldEmitOptions;
}
export interface StructEmitOptions extends StructEmitOptionsBase {
    perStructEmitOptions?: (struct: CSharpStruct) => PerStructEmitOptions;
}
export interface PerStructEmitOptions extends StructEmitOptionsBase {
    name?: string;
}
export declare class StructEmitter {
    private stringEmitter;
    private logger;
    private enumEmitter;
    private propertyEmitter;
    private fieldEmitter;
    private methodEmitter;
    private typeEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitStructs(structs: CSharpStruct[], options?: StructEmitOptions): void;
    emitStruct(struct: CSharpStruct, options?: StructEmitOptions): void;
    private prepareOptions(options?);
    private emitStructInterface(struct, options?);
}
