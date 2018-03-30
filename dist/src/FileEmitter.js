"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var StructEmitter_1 = require("./StructEmitter");
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter_1 = require("./ClassEmitter");
var InterfaceEmitter_1 = require("./InterfaceEmitter");
var NamespaceEmitter_1 = require("./NamespaceEmitter");
var FileEmitter = /** @class */ (function () {
    function FileEmitter(logger, stringEmitter, content) {
        this.logger = logger;
        this.stringEmitter = stringEmitter;
        this.fileParser = new fluffy_spoon_javascript_csharp_parser_1.FileParser(content);
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(this.stringEmitter, this.logger);
        this.classEmitter = new ClassEmitter_1.ClassEmitter(this.stringEmitter, this.logger);
        this.interfaceEmitter = new InterfaceEmitter_1.InterfaceEmitter(this.stringEmitter, this.logger);
        this.namespaceEmitter = new NamespaceEmitter_1.NamespaceEmitter(this.stringEmitter, this.logger);
        this.structEmitter = new StructEmitter_1.StructEmitter(this.stringEmitter, this.logger);
    }
    FileEmitter.prototype.emitFile = function (options) {
        debugger;
        if (!options)
            options = {};
        this.logger.log("Emitting file.");
        var file = this.fileParser.parseFile();
        if (options.onAfterParsing)
            options.onAfterParsing(file, this.stringEmitter);
        var nodes = new Array();
        for (var _i = 0, _a = file.enums; _i < _a.length; _i++) {
            var enumObject = _a[_i];
            var enumNode = this.enumEmitter.createTypeScriptEnumNode(enumObject, __assign({ declare: true }, options.enumEmitOptions));
            nodes.push(enumNode);
        }
        for (var _b = 0, _c = file.namespaces; _b < _c.length; _b++) {
            var namespace = _c[_b];
            var namespaceNodes = this.namespaceEmitter.createTypeScriptNamespaceNodes(namespace, __assign({ declare: true, nestingLevel: 0 }, options.namespaceEmitOptions));
            for (var _d = 0, namespaceNodes_1 = namespaceNodes; _d < namespaceNodes_1.length; _d++) {
                var namespaceNode = namespaceNodes_1[_d];
                nodes.push(namespaceNode);
            }
        }
        for (var _e = 0, _f = file.interfaces; _e < _f.length; _e++) {
            var interfaceObject = _f[_e];
            var interfaceNodes = this.interfaceEmitter.createTypeScriptInterfaceNodes(interfaceObject, __assign({ declare: true }, options.interfaceEmitOptions));
            for (var _g = 0, interfaceNodes_1 = interfaceNodes; _g < interfaceNodes_1.length; _g++) {
                var interfaceNode = interfaceNodes_1[_g];
                nodes.push(interfaceNode);
            }
        }
        for (var _h = 0, _j = file.classes; _h < _j.length; _h++) {
            var classObject = _j[_h];
            var classNodes = this.classEmitter.createTypeScriptClassNodes(classObject, __assign({ declare: true, nestingLevel: 0 }, options.classEmitOptions));
            for (var _k = 0, classNodes_1 = classNodes; _k < classNodes_1.length; _k++) {
                var classNode = classNodes_1[_k];
                nodes.push(classNode);
            }
        }
        for (var _l = 0, _m = file.structs; _l < _m.length; _l++) {
            var structObject = _m[_l];
            var structNode = this.structEmitter.createTypeScriptStructNode(structObject, __assign({ declare: true }, options.structEmitOptions));
            nodes.push(structNode);
        }
        this.stringEmitter.emitTypeScriptNodes(nodes);
        return this.stringEmitter.output;
    };
    return FileEmitter;
}());
exports.FileEmitter = FileEmitter;
//# sourceMappingURL=FileEmitter.js.map