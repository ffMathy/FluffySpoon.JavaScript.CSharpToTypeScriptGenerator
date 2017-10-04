"use strict";
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var StringEmitter_1 = require("./StringEmitter");
var StructEmitter_1 = require("./StructEmitter");
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter_1 = require("./ClassEmitter");
var InterfaceEmitter_1 = require("./InterfaceEmitter");
var NamespaceEmitter_1 = require("./NamespaceEmitter");
var Logger_1 = require("./Logger");
var FileEmitter = (function () {
    function FileEmitter(content) {
        this.fileParser = new fluffy_spoon_javascript_csharp_parser_1.FileParser(content);
        this.logger = new Logger_1.Logger();
        this.stringEmitter = new StringEmitter_1.StringEmitter(this.logger);
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(this.stringEmitter, this.logger);
        this.classEmitter = new ClassEmitter_1.ClassEmitter(this.stringEmitter, this.logger);
        this.interfaceEmitter = new InterfaceEmitter_1.InterfaceEmitter(this.stringEmitter, this.logger);
        this.namespaceEmitter = new NamespaceEmitter_1.NamespaceEmitter(this.stringEmitter, this.logger);
        this.structEmitter = new StructEmitter_1.StructEmitter(this.stringEmitter, this.logger);
    }
    FileEmitter.prototype.emitFile = function (options) {
        this.logger.log("Emitting file.");
        if (!options) {
            options = {};
        }
        if (options.classEmitOptions) {
            if (options.namespaceEmitOptions) {
                options.namespaceEmitOptions.classEmitOptions = options.classEmitOptions;
            }
        }
        if (options.interfaceEmitOptions) {
            if (options.namespaceEmitOptions) {
                options.namespaceEmitOptions.interfaceEmitOptions = options.interfaceEmitOptions;
            }
            if (options.classEmitOptions) {
                options.classEmitOptions.interfaceEmitOptions = options.interfaceEmitOptions;
            }
        }
        if (options.enumEmitOptions) {
            if (options.classEmitOptions) {
                options.classEmitOptions.enumEmitOptions = options.enumEmitOptions;
            }
            if (options.namespaceEmitOptions) {
                options.namespaceEmitOptions.enumEmitOptions = options.enumEmitOptions;
            }
        }
        if (options.structEmitOptions) {
            if (options.namespaceEmitOptions) {
                options.namespaceEmitOptions.structEmitOptions = options.structEmitOptions;
            }
        }
        var file = this.fileParser.parseFile();
        if (file.enums.length > 0) {
            this.enumEmitter.emitEnums(file.enums, options.enumEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (file.namespaces.length > 0) {
            this.namespaceEmitter.emitNamespaces(file.namespaces, options.namespaceEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (file.interfaces.length > 0) {
            this.interfaceEmitter.emitInterfaces(file.interfaces, options.interfaceEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (file.classes.length > 0) {
            this.classEmitter.emitClasses(file.classes, options.classEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (file.structs.length > 0) {
            this.structEmitter.emitStructs(file.structs, options.structEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        this.stringEmitter.removeLastNewLines();
        return this.stringEmitter.output;
    };
    return FileEmitter;
}());
exports.FileEmitter = FileEmitter;
