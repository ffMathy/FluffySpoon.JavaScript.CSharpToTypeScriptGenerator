"use strict";
var TypeEmitter = (function () {
    function TypeEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
    }
    TypeEmitter.prototype.emitType = function (type) {
        this.stringEmitter.write(type.name);
        if (type.genericParameters) {
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
