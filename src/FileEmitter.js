"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var StringEmitter_1 = require("./StringEmitter");
var OptionsHelper_1 = require("./OptionsHelper");
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
        this.optionsHelper = new OptionsHelper_1.OptionsHelper();
        this.stringEmitter = new StringEmitter_1.StringEmitter(this.logger);
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(this.stringEmitter, this.logger);
        this.classEmitter = new ClassEmitter_1.ClassEmitter(this.stringEmitter, this.logger);
        this.interfaceEmitter = new InterfaceEmitter_1.InterfaceEmitter(this.stringEmitter, this.logger);
        this.namespaceEmitter = new NamespaceEmitter_1.NamespaceEmitter(this.stringEmitter, this.logger);
        this.structEmitter = new StructEmitter_1.StructEmitter(this.stringEmitter, this.logger);
    }
    FileEmitter.prototype.emitFile = function (options) {
        this.logger.log("Emitting file.");
        console.log("Raw options are", JSON.stringify(options, null, 2));
        options = this.optionsHelper.prepareFileEmitOptionDefaults(options);
        console.log("Parsed options are", JSON.stringify(options, null, 2));
        var file = this.fileParser.parseFile();
        if (options.afterParsing)
            options.afterParsing(file, this.stringEmitter);
        console.log("File parsed as", JSON.stringify(file, function (key, value) {
            if (key === "parent")
                return;
            return value;
        }, 2));
        var nodes = new Array();
        for (var _i = 0, _a = file.namespaces; _i < _a.length; _i++) {
            var namespace = _a[_i];
            var namespaceNodes = this.namespaceEmitter.createTypeScriptNamespaceNodes(namespace, options.namespaceEmitOptions);
            for (var _b = 0, namespaceNodes_1 = namespaceNodes; _b < namespaceNodes_1.length; _b++) {
                var namespaceNode = namespaceNodes_1[_b];
                nodes.push(namespaceNode);
            }
        }
        for (var _c = 0, _d = file.classes; _c < _d.length; _c++) {
            var classObject = _d[_c];
            var classNodes = this.classEmitter.createTypeScriptClassNodes(classObject, Object.assign({ declare: true }, options.classEmitOptions));
            for (var _e = 0, classNodes_1 = classNodes; _e < classNodes_1.length; _e++) {
                var classNode = classNodes_1[_e];
                nodes.push(classNode);
            }
        }
        for (var _f = 0, _g = file.enums; _f < _g.length; _f++) {
            var enumObject = _g[_f];
            var enumNode = this.enumEmitter.createTypeScriptEnumNode(enumObject, Object.assign({ declare: true }, options.enumEmitOptions));
            nodes.push(enumNode);
        }
        for (var _h = 0, _j = file.structs; _h < _j.length; _h++) {
            var structObject = _j[_h];
            var structNode = this.structEmitter.createTypeScriptStructNode(structObject, Object.assign({ declare: true }, options.structEmitOptions));
            nodes.push(structNode);
        }
        /*if (file.enums.length > 0) {
            this.enumEmitter.emitEnums(file.enums, Object.assign({ declare: true }, options.enumEmitOptions));
            this.stringEmitter.ensureNewParagraph();
        }

        if (file.namespaces.length > 0) {
            this.namespaceEmitter.emitNamespaces(
                file.namespaces,
                Object.assign({ declare: true }, options.namespaceEmitOptions));
            this.stringEmitter.ensureNewParagraph();
        }

        if (file.interfaces.length > 0) {
            this.interfaceEmitter.emitInterfaces(
                file.interfaces,
                Object.assign({ declare: true }, options.interfaceEmitOptions));
            this.stringEmitter.ensureNewParagraph();
        }

        if (file.classes.length > 0) {
            this.classEmitter.emitClasses(
                file.classes,
                Object.assign({ declare: true }, options.classEmitOptions));
            this.stringEmitter.ensureNewParagraph();
        }

        if (file.structs.length > 0) {
            this.structEmitter.emitStructs(
                file.structs,
                Object.assign({ declare: true }, options.structEmitOptions));
            this.stringEmitter.ensureNewParagraph();
        }*/
        this.stringEmitter.emitTypeScriptNodes(nodes);
        return this.stringEmitter.output;
    };
    return FileEmitter;
}());
exports.FileEmitter = FileEmitter;
//# sourceMappingURL=FileEmitter.js.map