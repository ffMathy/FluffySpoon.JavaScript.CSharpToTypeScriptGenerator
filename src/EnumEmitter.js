"use strict";
var EnumEmitter = (function () {
    function EnumEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
    }
    EnumEmitter.prototype.emitEnums = function (enums, options) {
        for (var _i = 0, enums_1 = enums; _i < enums_1.length; _i++) {
            var enumObject = enums_1[_i];
            this.emitEnum(enumObject, options);
        }
    };
    EnumEmitter.prototype.emitEnum = function (enumObject, options) {
        if (!options) {
            options = {
                declare: true
            };
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        this.stringEmitter.write("enum " + enumObject.name + " {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        for (var _i = 0, _a = enumObject.options; _i < _a.length; _i++) {
            var option = _a[_i];
            this.emitEnumOption(option);
        }
        this.stringEmitter.removeLastCharacters(',\n');
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    };
    EnumEmitter.prototype.emitEnumOption = function (option) {
        this.stringEmitter.writeLine(option.name + " = " + option.value + ",");
    };
    return EnumEmitter;
}());
exports.EnumEmitter = EnumEmitter;
