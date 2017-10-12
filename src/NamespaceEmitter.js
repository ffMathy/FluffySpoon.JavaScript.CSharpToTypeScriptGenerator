"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter_1 = require("./ClassEmitter");
var InterfaceEmitter_1 = require("./InterfaceEmitter");
var StructEmitter_1 = require("./StructEmitter");
var ts = require("typescript");
var NamespaceEmitter = /** @class */ (function () {
    function NamespaceEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter, logger);
        this.classEmitter = new ClassEmitter_1.ClassEmitter(stringEmitter, logger);
        this.interfaceEmitter = new InterfaceEmitter_1.InterfaceEmitter(stringEmitter, logger);
        this.structEmitter = new StructEmitter_1.StructEmitter(stringEmitter, logger);
    }
    NamespaceEmitter.prototype.emitNamespaces = function (namespaces, options) {
        this.logger.log("Emitting namespaces", namespaces);
        for (var _i = 0, namespaces_1 = namespaces; _i < namespaces_1.length; _i++) {
            var namespace = namespaces_1[_i];
            this.emitNamespace(namespace, options);
        }
        this.logger.log("Done emitting namespaces", namespaces);
    };
    NamespaceEmitter.prototype.emitNamespace = function (namespace, options) {
        var nodes = this.createTypeScriptNamespaceNodes(namespace, options);
        this.stringEmitter.emitTypeScriptNodes(nodes);
    };
    NamespaceEmitter.prototype.createTypeScriptNamespaceNodes = function (namespace, options) {
        options = this.prepareOptions(options);
        if (!options.filter(namespace))
            return [];
        this.logger.log("Emitting namespace", namespace);
        var modifiers = new Array();
        if (options.declare)
            modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));
        var content = new Array();
        for (var _i = 0, _a = namespace.classes; _i < _a.length; _i++) {
            var classObject = _a[_i];
            var classNodes = this.classEmitter.createTypeScriptClassNodes(classObject, Object.assign({ declare: options.skip }, options.classEmitOptions));
            for (var _b = 0, classNodes_1 = classNodes; _b < classNodes_1.length; _b++) {
                var classNode = classNodes_1[_b];
                content.push(classNode);
            }
        }
        for (var _c = 0, _d = namespace.namespaces; _c < _d.length; _c++) {
            var namespaceObject = _d[_c];
            var namespaceNodes = this.createTypeScriptNamespaceNodes(namespaceObject, Object.assign({ declare: options.skip }, Object.assign({}, options)));
            for (var _e = 0, namespaceNodes_1 = namespaceNodes; _e < namespaceNodes_1.length; _e++) {
                var namespaceNode = namespaceNodes_1[_e];
                content.push(namespaceNode);
            }
        }
        for (var _f = 0, _g = namespace.enums; _f < _g.length; _f++) {
            var enumObject = _g[_f];
            content.push(this.enumEmitter.createTypeScriptEnumNode(enumObject, Object.assign({ declare: options.skip }, options.enumEmitOptions)));
        }
        var nodes = new Array();
        if (!options.skip) {
            nodes.push(ts.createModuleDeclaration([], modifiers, ts.createIdentifier(namespace.name), ts.createModuleBlock(content), ts.NodeFlags.Namespace | ts.NodeFlags.NestedNamespace));
        }
        else {
            nodes = content;
        }
        this.logger.log("Done emitting namespace", namespace);
        return nodes;
    };
    NamespaceEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (namespace) { return true; };
        }
        return options;
    };
    return NamespaceEmitter;
}());
exports.NamespaceEmitter = NamespaceEmitter;
//# sourceMappingURL=NamespaceEmitter.js.map