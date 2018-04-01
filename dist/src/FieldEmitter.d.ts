import { CSharpField } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface FieldEmitOptionsBase {
    readOnly?: boolean;
    filter?: (field: CSharpField) => boolean;
    perFieldEmitOptions?: (field: CSharpField) => PerFieldEmitOptions;
}
export interface FieldEmitOptionsLinks {
    typeEmitOptions?: TypeEmitOptions;
}
export interface FieldEmitOptions extends FieldEmitOptionsBase, FieldEmitOptionsLinks {
}
export interface PerFieldEmitOptions extends FieldEmitOptionsBase, FieldEmitOptionsLinks {
    name?: string;
}
export declare class FieldEmitter {
    private typeScriptEmitter;
    private logger;
    private optionsHelper;
    private typeEmitter;
    constructor(typeScriptEmitter: TypeScriptEmitter, logger: Logger);
    emitFields(fields: CSharpField[], options: FieldEmitOptions): void;
    emitField(field: CSharpField, options: FieldEmitOptions & PerFieldEmitOptions): void;
    createTypeScriptFieldNode(field: CSharpField, options: FieldEmitOptions & PerFieldEmitOptions): ts.PropertySignature;
}
