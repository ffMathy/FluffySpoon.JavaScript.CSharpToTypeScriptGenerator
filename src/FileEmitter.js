"use strict";
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var StringEmitter_1 = require("./StringEmitter");
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter_1 = require("./ClassEmitter");
var NamespaceEmitter_1 = require("./NamespaceEmitter");
var FileEmitter = (function () {
    function FileEmitter(content) {
        this.fileParser = new fluffy_spoon_javascript_csharp_parser_1.FileParser(content);
        this.stringEmitter = new StringEmitter_1.StringEmitter();
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(this.stringEmitter);
        this.classEmitter = new ClassEmitter_1.ClassEmitter(this.stringEmitter);
        this.namespaceEmitter = new NamespaceEmitter_1.NamespaceEmitter(this.stringEmitter);
    }
    FileEmitter.prototype.emitFile = function (options) {
        if (!options) {
            options = {};
        }
        if (options.classEmitOptions && options.namespaceEmitOptions) {
            options.namespaceEmitOptions.classEmitOptions = options.classEmitOptions;
        }
        var file = this.fileParser.parseFile();
        this.enumEmitter.emitEnums(file.enums);
        this.namespaceEmitter.emitNamespaces(file.namespaces, options.namespaceEmitOptions);
        this.classEmitter.emitClasses(file.classes, options.classEmitOptions);
        this.stringEmitter.removeLastCharacters("\n\n");
        return this.stringEmitter.output;
    };
    return FileEmitter;
}());
exports.FileEmitter = FileEmitter;
