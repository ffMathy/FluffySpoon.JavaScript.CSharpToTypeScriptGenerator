"use strict";
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var StringEmitter_1 = require("./StringEmitter");
var FileEmitter = (function () {
    function FileEmitter(content) {
        this.fileParser = new fluffy_spoon_javascript_csharp_parser_1.FileParser(content);
        this.stringEmitter = new StringEmitter_1.StringEmitter();
    }
    FileEmitter.prototype.emitFile = function () {
        var file = this.fileParser.parseFile();
        this.emitEnums(file.enums);
        return this.stringEmitter.output;
    };
    FileEmitter.prototype.emitEnums = function (enums) {
        for (var _i = 0, enums_1 = enums; _i < enums_1.length; _i++) {
            var enumObject = enums_1[_i];
            this.emitEnum(enumObject);
        }
    };
    FileEmitter.prototype.emitEnum = function (enumObject) {
        this.stringEmitter.writeLine("declare enum " + enumObject.name + " {");
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
    FileEmitter.prototype.emitEnumOption = function (option) {
        this.stringEmitter.writeLine(option.name + " = " + option.value + ",");
    };
    return FileEmitter;
}());
exports.FileEmitter = FileEmitter;
