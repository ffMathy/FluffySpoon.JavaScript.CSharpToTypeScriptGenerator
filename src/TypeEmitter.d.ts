import { CSharpType } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
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
    createTypeScriptExpressionWithTypeArguments(type: CSharpType, options?: TypeEmitOptions): ts.ExpressionWithTypeArguments;
    createTypeScriptTypeReferenceNode(type: CSharpType, options?: TypeEmitOptions): ts.TypeReferenceNode;
    createTypeScriptTypeParameterDeclaration(type: CSharpType, options?: TypeEmitOptions): ts.TypeParameterDeclaration;
    createTypeScriptTypeReferenceNodes(types: CSharpType[], options?: TypeEmitOptions): ts.TypeReferenceNode[];
    private prepareOptions(options?);
    private getNonGenericTypeName(type);
    private getNonGenericMatchingTypeMappingAsString(type, options?);
    private getMatchingTypeMappingAsType(type, options?);
    private getMatchingTypeMappingAsString(type, options?);
    private generateGenericParametersString(genericParameters, options);
    private substituteMultipleGenericReferencesIntoMapping(mappingKeyType, concreteType, mapping, options);
    private substituteGenericReferenceIntoMapping(referenceType, realType, mapping, options);
}
