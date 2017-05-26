"use strict";
var EnumEmitter = (function () {
    function EnumEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
    }
    EnumEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {
                declare: true,
                strategy: "default"
            };
        }
        if (!options.strategy) {
            options.strategy = "default";
        }
        return options;
    };
    EnumEmitter.prototype.emitEnums = function (enums, options) {
        for (var _i = 0, enums_1 = enums; _i < enums_1.length; _i++) {
            var enumObject = enums_1[_i];
            this.emitEnum(enumObject, options);
        }
        this.stringEmitter.removeLastCharacters("\n");
        if (options.strategy === "default") {
            this.stringEmitter.removeLastCharacters("}");
        }
    };
    EnumEmitter.prototype.emitEnum = function (enumObject, options) {
        options = this.prepareOptions(options);
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        if (options.strategy === "default") {
            this.stringEmitter.write("enum");
        }
        else if (options.strategy === "string-union") {
            this.stringEmitter.write("type");
        }
        this.stringEmitter.write(" " + enumObject.name + " ");
        if (options.strategy === "default") {
            this.stringEmitter.write("{");
        }
        else if (options.strategy === "string-union") {
            this.stringEmitter.write("=");
        }
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        for (var _i = 0, _a = enumObject.options; _i < _a.length; _i++) {
            var option = _a[_i];
            this.emitEnumOption(option, options);
        }
        this.stringEmitter.removeLastCharacters('\n');
        if (options.strategy === "default") {
            this.stringEmitter.removeLastCharacters(',');
        }
        else if (options.strategy === "string-union") {
            this.stringEmitter.removeLastCharacters(' |');
        }
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        if (options.strategy === "default") {
            this.stringEmitter.writeLine("}");
            this.stringEmitter.writeLine();
        }
    };
    EnumEmitter.prototype.emitEnumOption = function (option, options) {
        if (options.strategy === "default") {
            this.stringEmitter.writeLine(option.name + " = " + option.value + ",");
        }
        else if (options.strategy === "string-union") {
            this.stringEmitter.writeLine("'" + option.name + "' |");
        }
    };
    return EnumEmitter;
}());
exports.EnumEmitter = EnumEmitter;
