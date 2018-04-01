import { CSharpMethod } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface MethodEmitOptionsBase {
    filter?: (method: CSharpMethod) => boolean;
    perMethodEmitOptions?: (method: CSharpMethod) => PerMethodEmitOptions;
}
export interface MethodEmitOptionsLinks {
    returnTypeEmitOptions?: TypeEmitOptions;
    argumentTypeEmitOptions?: TypeEmitOptions;
}
export interface MethodEmitOptions extends MethodEmitOptionsBase, MethodEmitOptionsLinks {
}
export interface PerMethodEmitOptions extends MethodEmitOptionsBase, MethodEmitOptionsLinks {
    name?: string;
}
export declare class MethodEmitter {
    private typeScriptEmitter;
    private logger;
    private optionsHelper;
    private typeEmitter;
    constructor(typeScriptEmitter: TypeScriptEmitter, logger: Logger);
    emitMethods(methods: CSharpMethod[], options: MethodEmitOptions & PerMethodEmitOptions): void;
    emitMethod(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions): void;
    createTypeScriptMethodNode(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions): ts.MethodSignature;
    private createTypeScriptMethodParameterNodes(parameters, options);
    private createTypeScriptMethodParameterNode(parameter, options);
}
