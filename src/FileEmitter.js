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
        if (options.enumEmitOptions) {
            if (options.classEmitOptions) {
                options.classEmitOptions.enumEmitOptions = options.enumEmitOptions;
            }
            if (options.namespaceEmitOptions) {
                options.namespaceEmitOptions.enumEmitOptions = options.enumEmitOptions;
            }
        }
        var file = this.fileParser.parseFile();
        if (file.enums.length > 0) {
            this.enumEmitter.emitEnums(file.enums, options.enumEmitOptions);
            this.stringEmitter.writeLine();
        }
        if (file.namespaces.length > 0) {
            this.namespaceEmitter.emitNamespaces(file.namespaces, options.namespaceEmitOptions);
            this.stringEmitter.writeLine();
        }
        if (file.classes.length > 0) {
            this.classEmitter.emitClasses(file.classes, options.classEmitOptions);
            this.stringEmitter.writeLine();
        }
        this.stringEmitter.removeLastCharacters("\n\n");
        return this.stringEmitter.output;
    };
    return FileEmitter;
}());
exports.FileEmitter = FileEmitter;
