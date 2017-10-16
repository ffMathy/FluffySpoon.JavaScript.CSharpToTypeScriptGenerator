import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface PropertyEmitOptionsBase {
    readOnly?: boolean;
    filter?: (property: CSharpProperty) => boolean;
    typeEmitOptions?: TypeEmitOptions;
}
export interface PropertyEmitOptions extends PropertyEmitOptionsBase {
    perPropertyEmitOptions?: (property: CSharpProperty) => PerPropertyEmitOptions;
}
export interface PerPropertyEmitOptions extends PropertyEmitOptionsBase {
    name?: string;
}
export declare class PropertyEmitter {
    private stringEmitter;
    private logger;
    private typeEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitProperties(properties: CSharpProperty[], options: PropertyEmitOptions & PerPropertyEmitOptions): void;
    emitProperty(property: CSharpProperty, options: PropertyEmitOptions & PerPropertyEmitOptions): void;
    createTypeScriptPropertyNode(property: CSharpProperty, options: PropertyEmitOptions & PerPropertyEmitOptions): ts.PropertySignature;
}
