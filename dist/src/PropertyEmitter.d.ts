import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface PropertyEmitOptionsBase {
    readOnly?: boolean;
    filter?: (property: CSharpProperty) => boolean;
    perPropertyEmitOptions?: (property: CSharpProperty) => PerPropertyEmitOptions;
}
export interface PropertyEmitOptionsLinks {
    typeEmitOptions?: TypeEmitOptions;
}
export interface PropertyEmitOptions extends PropertyEmitOptionsBase, PropertyEmitOptionsLinks {
}
export interface PerPropertyEmitOptions extends PropertyEmitOptionsBase, PropertyEmitOptionsLinks {
    name?: string;
}
export declare class PropertyEmitter {
    private typeScriptEmitter;
    private logger;
    private typeEmitter;
    private optionsHelper;
    constructor(typeScriptEmitter: TypeScriptEmitter, logger: Logger);
    emitProperties(properties: CSharpProperty[], options: PropertyEmitOptions & PerPropertyEmitOptions): void;
    emitProperty(property: CSharpProperty, options: PropertyEmitOptions & PerPropertyEmitOptions): void;
    createTypeScriptPropertyNode(property: CSharpProperty, options: PropertyEmitOptions & PerPropertyEmitOptions): ts.PropertySignature;
}
