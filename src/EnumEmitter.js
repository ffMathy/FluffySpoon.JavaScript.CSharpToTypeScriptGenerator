"use strict";
var EnumEmitter = (function () {
    function EnumEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
    }
    EnumEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {
                strategy: "default"
            };
        }
        if (!options.strategy) {
            options.strategy = "default";
        }
        return options;
    };
    EnumEmitter.prototype.emitEnums = function (enums, options) {
        this.logger.log("Emitting enums", enums);
        options = this.prepareOptions(options);
        for (var _i = 0, enums_1 = enums; _i < enums_1.length; _i++) {
            var enumObject = enums_1[_i];
            this.emitEnum(enumObject, options);
        }
        this.stringEmitter.removeLastNewLines();
        this.logger.log("Done emitting enums", enums);
    };
    EnumEmitter.prototype.emitEnum = function (enumObject, options) {
        this.logger.log("Emitting enum", enumObject);
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
            var isLastOption = option === enumObject.options[enumObject.options.length - 1];
            this.emitEnumOption(option, isLastOption, options);
        }
        if (options.strategy === "default") {
            this.stringEmitter.removeLastCharacters(',');
        }
        else if (options.strategy === "string-union") {
            this.stringEmitter.removeLastCharacters(' |\n');
        }
        this.stringEmitter.decreaseIndentation();
        if (options.strategy === "default") {
            this.stringEmitter.writeLine("}");
        }
        this.stringEmitter.ensureNewParagraph();
        this.logger.log("Done emitting enum", enumObject);
    };
    EnumEmitter.prototype.emitEnumOption = function (option, isLast, options) {
        this.logger.log("Emitting enum option", option);
        if (options.strategy === "default") {
            this.stringEmitter.write(this.stringEmitter.currentIndentation + option.name + " = " + option.value);
            if (!isLast)
                this.stringEmitter.write(",");
            this.stringEmitter.writeLine();
        }
        else if (options.strategy === "string-union") {
            this.stringEmitter.writeLine("'" + option.name + "' |");
        }
    };
    return EnumEmitter;
}());
exports.EnumEmitter = EnumEmitter;
//# sourceMappingURL=EnumEmitter.js.map