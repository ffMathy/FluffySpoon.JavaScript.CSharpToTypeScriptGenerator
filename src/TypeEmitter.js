"use strict";
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var RegExHelper_1 = require("./RegExHelper");
var TypeEmitter = (function () {
    function TypeEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeParser = new fluffy_spoon_javascript_csharp_parser_1.TypeParser();
        this.regexHelper = new RegExHelper_1.RegExHelper();
        this.defaultTypeMap = {
            "IList<T>": "T[]",
            "List<T>": "T[]",
            "IEnumerable<T>": "T[]",
            "ICollection<T>": "T[]",
            "Array<T>": "T[]",
            "HashSet<T>": "T[]",
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
        return this.prepareOptions(options).filter(type);
    };
    TypeEmitter.prototype.emitType = function (type, options) {
        options = this.prepareOptions(options);
        if (!this.canEmitType(type, options))
            return;
        var mapping = this.getMatchingTypeMapping(type, options);
        this.logger.log("Emitting type " + type.fullName);
        this.stringEmitter.write(mapping);
    };
    TypeEmitter.prototype.emitGenericParameters = function (genericParameters, options) {
        options = this.prepareOptions(options);
        this.stringEmitter.write(this.generateGenericParametersString(genericParameters, options));
    };
    TypeEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (property) { return true; };
        }
        return options;
    };
    TypeEmitter.prototype.getNonGenericTypeName = function (type) {
        var typeName = type.name;
        if (type.genericParameters) {
            var lastArrowIndex = typeName.lastIndexOf("<");
            typeName = typeName.substr(0, lastArrowIndex);
        }
        return typeName;
    };
    TypeEmitter.prototype.getMatchingTypeMapping = function (type, options) {
        if (options && options.mapper) {
            var mapping_1 = options.mapper(type, this.getMatchingTypeMapping(type));
            if (mapping_1)
                return mapping_1;
        }
        for (var mappingKey in this.defaultTypeMap) {
            if (!this.defaultTypeMap.hasOwnProperty(mappingKey))
                continue;
            var mappingKeyType = this.typeParser.parseType(mappingKey);
            if (type.name !== mappingKeyType.name)
                continue;
            var mapping_2 = this.defaultTypeMap[mappingKey];
            if (mappingKeyType.genericParameters) {
                mapping_2 = this.substituteMultipleGenericReferencesIntoMapping(mappingKeyType, type, mapping_2, options);
            }
            return mapping_2;
        }
        var mapping = this.getNonGenericTypeName(type);
        if (type.genericParameters) {
            mapping += this.generateGenericParametersString(type.genericParameters, options);
        }
        return mapping;
    };
    TypeEmitter.prototype.generateGenericParametersString = function (genericParameters, options) {
        var mapping = "<";
        for (var _i = 0, genericParameters_1 = genericParameters; _i < genericParameters_1.length; _i++) {
            var genericParameter = genericParameters_1[_i];
            mapping += this.getMatchingTypeMapping(genericParameter, options);
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
        var realTypeMapping = this.getMatchingTypeMapping(realType, options);
        var referenceNameInput = this.regexHelper.escape(referenceType.name);
        var pattern = new RegExp("((?:[^\\w]|^)+)(" + referenceNameInput + ")((?:[^\\w]|$)+)", "g");
        mapping = mapping.replace(pattern, "$1" + realTypeMapping + "$3");
        return mapping;
    };
    return TypeEmitter;
}());
exports.TypeEmitter = TypeEmitter;
