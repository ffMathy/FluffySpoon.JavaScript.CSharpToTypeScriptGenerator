"use strict";
var TypeEmitter = (function () {
    function TypeEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.defaultTypeMap = {
            "IList<T>": "T[]",
            "List<T>": "T[]",
            "IEnumerable<T>": "T[]",
            "ICollection<T>": "T[]",
            "HashSet<T>": "T[]",
            "IDictionary<T,K>": "{ [key: T]: K }",
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
        this.stringEmitter.write(type.name);
        if (type.genericParameters) {
            var lastArrowIndex = this.stringEmitter.output.lastIndexOf("<");
            var regionToRemove = this.stringEmitter.output.substring(lastArrowIndex);
            this.stringEmitter.removeLastCharacters(regionToRemove);
            this.stringEmitter.write("<");
            for (var _i = 0, _a = type.genericParameters; _i < _a.length; _i++) {
                var genericParameter = _a[_i];
                this.emitType(genericParameter);
            }
            this.stringEmitter.removeLastCharacters(", ");
            this.stringEmitter.write(">");
        }
    };
    return TypeEmitter;
}());
exports.TypeEmitter = TypeEmitter;
