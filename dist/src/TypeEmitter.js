"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var RegExHelper_1 = require("./RegExHelper");
var ts = require("typescript");
var TypeEmitter = /** @class */ (function () {
    function TypeEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeParser = new fluffy_spoon_javascript_csharp_parser_1.TypeParser();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.defaultTypeMap = {
            "IList<T>": "Array<T>",
            "List<T>": "Array<T>",
            "IEnumerable<T>": "Array<T>",
            "ICollection<T>": "Array<T>",
            "Array<T>": "Array<T>",
            "HashSet<T>": "Array<T>",
            "IDictionary<T,K>": "{ [key: T]: K }",
            "Task<T>": "Promise<T>",
            "Task": "Promise<void>",
            "int": "number",
            "double": "number",
            "float": "number",
            "Int32": "number",
            "Int64": "number",
            "short": "number",
            "long": "number",
            "decimal": "number",
            "bool": "boolean",
            "DateTime": "string",
            "Guid": "string",
            "dynamic": "any",
            "object": "any"
        };
    }
    TypeEmitter.prototype.canEmitType = function (type, options) {
        return options.filter(type);
    };
    TypeEmitter.prototype.emitType = function (type, options) {
        var node = this.createTypeScriptTypeReferenceNode(type, options);
        if (!node)
            return;
        this.stringEmitter.emitTypeScriptNode(node);
    };
    TypeEmitter.prototype.emitGenericParameters = function (genericParameters, options) {
        this.stringEmitter.write(this.generateGenericParametersString(genericParameters, options));
    };
    TypeEmitter.prototype.createTypeScriptExpressionWithTypeArguments = function (type, options) {
        var typeName = this.getNonGenericMatchingTypeMappingAsString(type, options);
        return ts.createExpressionWithTypeArguments(this.createTypeScriptTypeReferenceNodes(type.genericParameters || [], options), ts.createIdentifier(typeName));
    };
    TypeEmitter.prototype.createTypeScriptTypeReferenceNode = function (type, options) {
        if (!this.canEmitType(type, options))
            return null;
        this.logger.log("Emitting type", type);
        var node;
        var typeMappingAsType = this.getMatchingTypeMappingAsType(type, options);
        if (!typeMappingAsType) {
            var typeString = this.getMatchingTypeMappingAsString(type, options);
            var typeFile = ts.createSourceFile("", "let tmp: " + typeString, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
            var literalNode = typeFile.statements[0].declarationList.declarations[0].type;
            node = literalNode;
        }
        else {
            node = this.createTypeScriptTypeReferenceNodes([typeMappingAsType], options)[0];
        }
        this.logger.log("Done emitting type", type);
        return node;
    };
    TypeEmitter.prototype.createTypeScriptTypeParameterDeclaration = function (type, options) {
        return ts.createTypeParameterDeclaration(this.getNonGenericMatchingTypeMappingAsString(type, options));
    };
    TypeEmitter.prototype.createTypeScriptTypeReferenceNodes = function (types, options) {
        var nodes = new Array();
        if (!types)
            return nodes;
        for (var _i = 0, types_1 = types; _i < types_1.length; _i++) {
            var type = types_1[_i];
            var node = ts.createTypeReferenceNode(this.getNonGenericTypeName(type), type === null ? [] : this.createTypeScriptTypeReferenceNodes(type.genericParameters, options));
            nodes.push(node);
        }
        return nodes;
    };
    TypeEmitter.prototype.getNonGenericTypeName = function (type) {
        if (type === null)
            return null;
        var typeName = type.name;
        if (type.genericParameters) {
            var lastArrowIndex = typeName.lastIndexOf("<");
            typeName = typeName.substr(0, lastArrowIndex);
        }
        return typeName;
    };
    TypeEmitter.prototype.getNonGenericMatchingTypeMappingAsString = function (type, options) {
        var mapping = this.getMatchingTypeMappingAsType(type, options);
        var typeName = this.getNonGenericTypeName(mapping);
        return typeName;
    };
    TypeEmitter.prototype.getMatchingTypeMappingAsType = function (type, options) {
        var mapping = this.getMatchingTypeMappingAsString(type, options);
        if (mapping.startsWith('{') && mapping.endsWith('}'))
            return null;
        var type = this.typeParser.parseType(mapping);
        return type;
    };
    TypeEmitter.prototype.getMatchingTypeMappingAsString = function (type, options) {
        if (options && options.mapper) {
            var mappedValue_1 = options.mapper(type, this.defaultTypeMap[type.name] || type.name);
            this.logger.log("mapping", type, mappedValue_1);
            if (mappedValue_1)
                return mappedValue_1;
        }
        for (var mappingKey in this.defaultTypeMap) {
            if (!this.defaultTypeMap.hasOwnProperty(mappingKey))
                continue;
            var mappingKeyType = this.typeParser.parseType(mappingKey);
            if (type.name !== mappingKeyType.name)
                continue;
            var mapping = this.defaultTypeMap[mappingKey];
            if (mappingKeyType.genericParameters) {
                mapping = this.substituteMultipleGenericReferencesIntoMapping(mappingKeyType, type, mapping, options);
            }
            return mapping;
        }
        var mappedValue = this.getNonGenericTypeName(type);
        if (type.genericParameters) {
            mappedValue += this.generateGenericParametersString(type.genericParameters, options);
        }
        return mappedValue;
    };
    TypeEmitter.prototype.generateGenericParametersString = function (genericParameters, options) {
        var mapping = "<";
        for (var _i = 0, genericParameters_1 = genericParameters; _i < genericParameters_1.length; _i++) {
            var genericParameter = genericParameters_1[_i];
            mapping += this.getMatchingTypeMappingAsString(genericParameter, options);
            if (genericParameter !== genericParameters[genericParameters.length - 1])
                mapping += ", ";
        }
        mapping += ">";
        return mapping;
    };
    TypeEmitter.prototype.substituteMultipleGenericReferencesIntoMapping = function (mappingKeyType, concreteType, mapping, options) {
        for (var i = 0; i < mappingKeyType.genericParameters.length; i++) {
            var mappingGenericParameter = mappingKeyType.genericParameters[i];
            var mappingRealParameter = concreteType.genericParameters[i];
            if (mappingGenericParameter.genericParameters) {
                mapping = this.substituteMultipleGenericReferencesIntoMapping(mappingGenericParameter, mappingRealParameter, mapping, options);
            }
            mapping = this.substituteGenericReferenceIntoMapping(mappingGenericParameter, mappingRealParameter, mapping, options);
        }
        return mapping;
    };
    TypeEmitter.prototype.substituteGenericReferenceIntoMapping = function (referenceType, realType, mapping, options) {
        var realTypeMapping = this.getMatchingTypeMappingAsString(realType, options);
        var referenceNameInput = this.regexHelper.escape(referenceType.name);
        var pattern = new RegExp("((?:[^\\w]|^)+)(" + referenceNameInput + ")((?:[^\\w]|$)+)", "g");
        mapping = mapping.replace(pattern, "$1" + realTypeMapping + "$3");
        return mapping;
    };
    return TypeEmitter;
}());
exports.TypeEmitter = TypeEmitter;
//# sourceMappingURL=TypeEmitter.js.map