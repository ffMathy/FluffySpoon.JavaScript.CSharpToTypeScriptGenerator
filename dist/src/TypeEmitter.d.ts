import { CSharpType } from 'fluffy-spoon.javascript.csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { Logger } from './Logger';
import ts = require("typescript");
export interface TypeEmitOptionsBase {
    mapper?: (type: CSharpType, suggestedOutput: string) => string;
    filter?: (type: CSharpType) => boolean;
}
export interface TypeEmitOptions extends TypeEmitOptionsBase {
}
export declare class TypeEmitter {
    private typeScriptEmitter;
    private logger;
    private defaultTypeMap;
    private typeParser;
    private regexHelper;
    constructor(typeScriptEmitter: TypeScriptEmitter, logger: Logger);
    canEmitType(type: CSharpType, options?: TypeEmitOptions): boolean;
    emitType(type: CSharpType, options?: TypeEmitOptions): void;
    emitGenericParameters(genericParameters: CSharpType[], options: TypeEmitOptions): void;
    createTypeScriptExpressionWithTypeArguments(type: CSharpType, options: TypeEmitOptions): ts.ExpressionWithTypeArguments;
    createTypeScriptTypeReferenceNode(type: CSharpType, options: TypeEmitOptions): ts.TypeReferenceNode | ts.TypeLiteralNode;
    createTypeScriptTypeParameterDeclaration(type: CSharpType, options: TypeEmitOptions): ts.TypeParameterDeclaration;
    createTypeScriptTypeReferenceNodes(types: CSharpType[], options: TypeEmitOptions): ts.TypeReferenceNode[];
    convertTypeToTypeScript(type: CSharpType, options?: TypeEmitOptions): string;
    private getNonGenericTypeName(type);
    private getNonGenericMatchingTypeMappingAsString(type, options);
    private getMatchingTypeMappingAsType(type, options);
    private generateGenericParametersString(genericParameters, options);
    private substituteMultipleGenericReferencesIntoMapping(mappingKeyType, concreteType, mapping, options);
    private substituteGenericReferenceIntoMapping(referenceType, realType, mapping, options);
}
