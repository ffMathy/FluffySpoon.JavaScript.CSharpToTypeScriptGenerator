import { CSharpMethod } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface MethodEmitOptionsBase {
    filter?: (method: CSharpMethod) => boolean;
    returnTypeEmitOptions?: TypeEmitOptions;
    argumentTypeEmitOptions?: TypeEmitOptions;
}
export interface MethodEmitOptions extends MethodEmitOptionsBase {
    perMethodEmitOptions?: (method: CSharpMethod) => PerMethodEmitOptions;
}
export interface PerMethodEmitOptions extends MethodEmitOptionsBase {
    name?: string;
}
export declare class MethodEmitter {
    private stringEmitter;
    private logger;
    private typeEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitMethods(methods: CSharpMethod[], options: MethodEmitOptions & PerMethodEmitOptions): void;
    emitMethod(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions): void;
    createTypeScriptMethodNode(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions): ts.MethodSignature;
    private createTypeScriptMethodParameterNodes(parameters, options);
    private createTypeScriptMethodParameterNode(parameter, options);
}
