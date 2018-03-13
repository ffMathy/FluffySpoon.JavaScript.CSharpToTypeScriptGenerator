import { CSharpInterface } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface InterfaceEmitOptionsBase {
    declare?: boolean;
    filter?: (method: CSharpInterface) => boolean;
    propertyEmitOptions?: PropertyEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
    genericParameterTypeEmitOptions?: TypeEmitOptions;
    inheritedTypeEmitOptions?: TypeEmitOptions;
}
export interface InterfaceEmitOptions extends InterfaceEmitOptionsBase {
    perInterfaceEmitOptions?: (interfaceObject: CSharpInterface) => PerInterfaceEmitOptions;
}
export interface PerInterfaceEmitOptions extends InterfaceEmitOptionsBase {
    name?: string;
}
export declare class InterfaceEmitter {
    private stringEmitter;
    private logger;
    private propertyEmitter;
    private methodEmitter;
    private typeEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitInterfaces(interfaces: CSharpInterface[], options: InterfaceEmitOptions): void;
    emitInterface(interfaceObject: CSharpInterface, options: InterfaceEmitOptions): void;
    createTypeScriptInterfaceNodes(interfaceObject: CSharpInterface, options: InterfaceEmitOptions & PerInterfaceEmitOptions): ts.Statement[];
}
