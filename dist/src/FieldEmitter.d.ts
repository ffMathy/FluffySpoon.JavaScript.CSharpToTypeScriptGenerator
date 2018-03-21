import { CSharpField } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface FieldEmitOptionsBase {
    readOnly?: boolean;
    filter?: (field: CSharpField) => boolean;
}
export interface FieldEmitOptionsLinks {
    typeEmitOptions?: TypeEmitOptions;
}
export interface FieldEmitOptions extends FieldEmitOptionsBase, FieldEmitOptionsLinks {
    perFieldEmitOptions?: (field: CSharpField) => PerFieldEmitOptions;
}
export interface PerFieldEmitOptions extends FieldEmitOptionsBase, FieldEmitOptionsLinks {
    name?: string;
}
export declare class FieldEmitter {
    private stringEmitter;
    private logger;
    private typeEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitFields(fields: CSharpField[], options: FieldEmitOptions): void;
    emitField(field: CSharpField, options: FieldEmitOptions & PerFieldEmitOptions): void;
    createTypeScriptFieldNode(field: CSharpField, options: FieldEmitOptions & PerFieldEmitOptions): ts.PropertySignature;
}
