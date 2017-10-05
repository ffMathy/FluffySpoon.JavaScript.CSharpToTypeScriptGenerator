import { CSharpType } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { Logger } from './Logger';
export interface TypeEmitOptions {
    mapper?: (type: CSharpType, suggestedOutput: string) => string;
    filter?: (type: CSharpType) => boolean;
}
export declare class TypeEmitter {
    private stringEmitter;
    private logger;
    private defaultTypeMap;
    private typeParser;
    private regexHelper;
    constructor(stringEmitter: StringEmitter, logger: Logger);
    canEmitType(type: CSharpType, options?: TypeEmitOptions): boolean;
    emitType(type: CSharpType, options?: TypeEmitOptions): void;
    emitGenericParameters(genericParameters: CSharpType[], options?: TypeEmitOptions): void;
    private prepareOptions(options?);
    private getNonGenericTypeName(type);
    private getMatchingTypeMapping(type, options?);
    private generateGenericParametersString(genericParameters, options);
    private substituteMultipleGenericReferencesIntoMapping(mappingKeyType, concreteType, mapping, options);
    private substituteGenericReferenceIntoMapping(referenceType, realType, mapping, options);
}
