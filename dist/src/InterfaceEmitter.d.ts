import { CSharpInterface } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface InterfaceEmitOptionsBase {
    declare?: boolean;
    filter?: (method: CSharpInterface) => boolean;
    perInterfaceEmitOptions?: (interfaceObject: CSharpInterface) => PerInterfaceEmitOptions;
}
export interface InterfaceEmitOptionsLinks {
    propertyEmitOptions?: PropertyEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
    genericParameterTypeEmitOptions?: TypeEmitOptions;
    inheritedTypeEmitOptions?: TypeEmitOptions;
}
export interface InterfaceEmitOptions extends InterfaceEmitOptionsBase, InterfaceEmitOptionsLinks {
}
export interface PerInterfaceEmitOptions extends InterfaceEmitOptionsBase, InterfaceEmitOptionsLinks {
    name?: string;
}
export declare class InterfaceEmitter {
    private typeScriptEmitter;
    private logger;
    private optionsHelper;
    private propertyEmitter;
    private methodEmitter;
    private typeEmitter;
    constructor(typeScriptEmitter: TypeScriptEmitter, logger: Logger);
    emitInterfaces(interfaces: CSharpInterface[], options: InterfaceEmitOptions): void;
    emitInterface(interfaceObject: CSharpInterface, options: InterfaceEmitOptions): void;
    createTypeScriptInterfaceNodes(interfaceObject: CSharpInterface, options: InterfaceEmitOptions & PerInterfaceEmitOptions): ts.Statement[];
}
