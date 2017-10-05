import { CSharpEnum } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { Logger } from './Logger';
export interface EnumEmitOptions {
    declare?: boolean;
    strategy?: "default" | "string-union";
}
export declare class EnumEmitter {
    private stringEmitter;
    private logger;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    private prepareOptions(options?);
    emitEnums(enums: CSharpEnum[], options?: EnumEmitOptions): void;
    emitEnum(enumObject: CSharpEnum, options?: EnumEmitOptions): void;
    private emitEnumOption(option, isLast, options);
}
