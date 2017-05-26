"use strict";
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var RegExHelper_1 = require("./RegExHelper");
var TypeEmitter = (function () {
    function TypeEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.typeParser = new fluffy_spoon_javascript_csharp_parser_1.TypeParser();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.defaultTypeMap = {
            "IList<T>": "T[]",
            "List<T>": "T[]",
            "IEnumerable<T>": "T[]",
            "ICollection<T>": "T[]",
            "HashSet<T>": "T[]",
            "IDictionary<T,K>": "{ [key: T]: K }",
            "Task<T>": "Promise<T>",
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
    TypeEmitter.prototype.emitType = function (type) {
        var mapping = this.getMatchingTypeMapping(type);
        this.stringEmitter.write(mapping);
    };
    TypeEmitter.prototype.getNonGenericTypeName = function (type) {
        var typeName = type.name;
        if (type.genericParameters) {
            var lastArrowIndex = typeName.lastIndexOf("<");
            typeName = typeName.substr(0, lastArrowIndex);
        }
        return typeName;
    };
    TypeEmitter.prototype.getMatchingTypeMapping = function (type) {
        for (var mappingKey in this.defaultTypeMap) {
            if (!this.defaultTypeMap.hasOwnProperty(mappingKey))
                continue;
            var mappingKeyType = this.typeParser.parseType(mappingKey);
            if (type.name !== mappingKeyType.name)
                continue;
            var mapping = this.defaultTypeMap[mappingKey];
            if (mappingKeyType.genericParameters) {
                mapping = this.substituteMultipleGenericReferencesIntoMapping(mappingKeyType, type, mapping);
            }
            return mapping;
        }
        return type.name;
    };
    TypeEmitter.prototype.substituteMultipleGenericReferencesIntoMapping = function (mappingKeyType, concreteType, mapping) {
        var beforeMapping = mapping;
        for (var i = 0; i < mappingKeyType.genericParameters.length; i++) {
            var mappingGenericParameter = mappingKeyType.genericParameters[i];
            var mappingRealParameter = concreteType.genericParameters[i];
            if (mappingGenericParameter.genericParameters) {
                mapping = this.substituteMultipleGenericReferencesIntoMapping(mappingGenericParameter, mappingRealParameter, mapping);
            }
            mapping = this.substituteGenericReferenceIntoMapping(mappingGenericParameter, mappingRealParameter, mapping);
        }
        return mapping;
    };
    TypeEmitter.prototype.substituteGenericReferenceIntoMapping = function (referenceType, realType, mapping) {
        var beforeMapping = mapping;
        var realTypeMapping = this.getMatchingTypeMapping(realType);
        var referenceNameInput = this.regexHelper.escape(referenceType.name);
        var pattern = new RegExp("((?:[^\\w]|^)+)(" + referenceNameInput + ")((?:[^\\w]|$)+)", "g");
        mapping = mapping.replace(pattern, "$1" + realTypeMapping + "$3");
        return mapping;
    };
    return TypeEmitter;
}());
exports.TypeEmitter = TypeEmitter;
