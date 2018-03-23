import { CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
import { NestingLevelMixin } from './Emitter';
export interface NamespaceEmitOptionsBase {
    declare?: boolean;
    skip?: boolean;
    filter?: (namespace: CSharpNamespace) => boolean;
}
export interface NamespaceEmitOptionsLinks {
    classEmitOptions?: ClassEmitOptions;
    interfaceEmitOptions?: InterfaceEmitOptions;
    structEmitOptions?: StructEmitOptions;
    enumEmitOptions?: EnumEmitOptions;
}
export interface NamespaceEmitOptions extends NamespaceEmitOptionsBase, NamespaceEmitOptionsLinks {
}
export declare class NamespaceEmitter {
    private stringEmitter;
    private logger;
    private enumEmitter;
    private classEmitter;
    private interfaceEmitter;
    private structEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitNamespaces(namespaces: CSharpNamespace[], options: NamespaceEmitOptions & NestingLevelMixin): void;
    emitNamespace(namespace: CSharpNamespace, options: NamespaceEmitOptions & NestingLevelMixin): void;
    createTypeScriptNamespaceNodes(namespace: CSharpNamespace, options: NamespaceEmitOptions & NestingLevelMixin): ts.Statement[];
}
