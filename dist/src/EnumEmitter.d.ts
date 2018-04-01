import { CSharpEnum } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface EnumEmitOptionsBase {
    declare?: boolean;
    strategy?: "default" | "string-union";
    filter?: (enumObject: CSharpEnum) => boolean;
}
export interface EnumEmitOptions extends EnumEmitOptionsBase {
}
export declare class EnumEmitter {
    private typeScriptEmitter;
    private logger;
    constructor(typeScriptEmitter: TypeScriptEmitter, logger: Logger);
    emitEnums(enums: CSharpEnum[], options: EnumEmitOptions): void;
    emitEnum(enumObject: CSharpEnum, options: EnumEmitOptions): void;
    createTypeScriptEnumNode(enumObject: CSharpEnum, options: EnumEmitOptions): ts.Statement;
}
