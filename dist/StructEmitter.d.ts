import { CSharpStruct } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface StructEmitOptionsBase {
    declare?: boolean;
    filter?: (struct: CSharpStruct) => boolean;
}
export interface StructEmitOptionsLinks {
    propertyEmitOptions?: PropertyEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
    fieldEmitOptions?: FieldEmitOptions;
}
export interface StructEmitOptions extends StructEmitOptionsBase, StructEmitOptionsLinks {
    perStructEmitOptions?: (struct: CSharpStruct) => PerStructEmitOptions;
}
export interface PerStructEmitOptions extends StructEmitOptionsBase, StructEmitOptionsLinks {
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
    emitStructs(structs: CSharpStruct[], options: StructEmitOptions): void;
    emitStruct(struct: CSharpStruct, options: StructEmitOptions): void;
    createTypeScriptStructNode(struct: CSharpStruct, options: StructEmitOptions & PerStructEmitOptions): ts.InterfaceDeclaration;
}
