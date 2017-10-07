import { CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';
export interface NamespaceEmitOptions {
    declare?: boolean;
    skip?: boolean;
    filter?: (namespace: CSharpNamespace) => boolean;
    classEmitOptions?: ClassEmitOptions;
    interfaceEmitOptions?: InterfaceEmitOptions;
    structEmitOptions?: StructEmitOptions;
    enumEmitOptions?: EnumEmitOptions;
}
export declare class NamespaceEmitter {
    private stringEmitter;
    private logger;
    private enumEmitter;
    private classEmitter;
    private interfaceEmitter;
    private structEmitter;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitNamespaces(namespaces: CSharpNamespace[], options?: NamespaceEmitOptions): void;
    emitNamespace(namespace: CSharpNamespace, options?: NamespaceEmitOptions): void;
    createTypeScriptNamespaceNode(namespace: CSharpNamespace, options?: NamespaceEmitOptions): any;
    private prepareOptions(options?);
}
