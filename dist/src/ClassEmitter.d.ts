import { CSharpClass } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { StructEmitOptions } from './StructEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
import { NestingLevelMixin } from './Emitter';
export interface ClassEmitOptionsBase {
    declare?: boolean;
    filter?: (classObject: CSharpClass) => boolean;
    perClassEmitOptions?: (classObject: CSharpClass) => PerClassEmitOptions;
}
export interface ClassEmitOptionsLinks {
    enumEmitOptions?: EnumEmitOptions;
    propertyEmitOptions?: PropertyEmitOptions;
    interfaceEmitOptions?: InterfaceEmitOptions;
    methodEmitOptions?: MethodEmitOptions;
    fieldEmitOptions?: FieldEmitOptions;
    structEmitOptions?: StructEmitOptions;
    genericParameterTypeEmitOptions?: TypeEmitOptions;
    inheritedTypeEmitOptions?: TypeEmitOptions;
}
export interface ClassEmitOptions extends ClassEmitOptionsBase, ClassEmitOptionsLinks {
}
export interface PerClassEmitOptions extends ClassEmitOptionsBase, ClassEmitOptionsLinks {
    name?: string;
}
export declare class ClassEmitter {
    private stringEmitter;
    private logger;
    private enumEmitter;
    private propertyEmitter;
    private fieldEmitter;
    private methodEmitter;
    private interfaceEmitter;
    private typeEmitter;
    private optionsHelper;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    emitClasses(classes: CSharpClass[], options: ClassEmitOptions & NestingLevelMixin): void;
    emitClass(classObject: CSharpClass, options: ClassEmitOptions & NestingLevelMixin): void;
    createTypeScriptClassNodes(classObject: CSharpClass, options: ClassEmitOptions & PerClassEmitOptions & NestingLevelMixin): ts.Statement[];
}
