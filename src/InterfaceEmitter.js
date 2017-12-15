"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var MethodEmitter_1 = require("./MethodEmitter");
var ts = require("typescript");
var InterfaceEmitter = /** @class */ (function () {
    function InterfaceEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.propertyEmitter = new PropertyEmitter_1.PropertyEmitter(stringEmitter, logger);
        this.methodEmitter = new MethodEmitter_1.MethodEmitter(stringEmitter, logger);
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
    }
    InterfaceEmitter.prototype.emitInterfaces = function (interfaces, options) {
        this.logger.log("Emitting interfaces", interfaces);
        for (var _i = 0, interfaces_1 = interfaces; _i < interfaces_1.length; _i++) {
            var interfaceObject = interfaces_1[_i];
            this.emitInterface(interfaceObject, options);
        }
        this.stringEmitter.removeLastNewLines();
        this.logger.log("Done emitting interfaces", interfaces);
    };
    InterfaceEmitter.prototype.emitInterface = function (interfaceObject, options) {
        var nodes = this.createTypeScriptInterfaceNodes(interfaceObject, options);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            this.stringEmitter.emitTypeScriptNode(node);
        }
    };
    InterfaceEmitter.prototype.createTypeScriptInterfaceNodes = function (interfaceObject, options) {
        var _this = this;
        options = Object.assign(options, options.perInterfaceEmitOptions(interfaceObject));
        if (!options.filter(interfaceObject))
            return [];
        if (interfaceObject.properties.length === 0 && interfaceObject.methods.length === 0) {
            this.logger.log("Skipping emitting body of interface " + interfaceObject.name + " because it contains no properties or methods");
            return [];
        }
        this.logger.log("Emitting interface", interfaceObject);
        var nodes = new Array();
        var modifiers = new Array();
        if (options.declare)
            modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));
        var heritageClauses = new Array();
        if (interfaceObject.inheritsFrom && this.typeEmitter.canEmitType(interfaceObject.inheritsFrom, options.inheritedTypeEmitOptions))
            heritageClauses.push(ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [this.typeEmitter.createTypeScriptExpressionWithTypeArguments(interfaceObject.inheritsFrom, options.inheritedTypeEmitOptions)]));
        var properties = interfaceObject
            .properties
            .map(function (x) { return _this
            .propertyEmitter
            .createTypeScriptPropertyNode(x, options.propertyEmitOptions); });
        var methods = interfaceObject
            .methods
            .map(function (x) { return _this
            .methodEmitter
            .createTypeScriptMethodNode(x, options.methodEmitOptions); });
        var genericParameters = new Array();
        if (interfaceObject.genericParameters)
            genericParameters = genericParameters.concat(interfaceObject
                .genericParameters
                .map(function (x) { return _this
                .typeEmitter
                .createTypeScriptTypeParameterDeclaration(x, options.genericParameterTypeEmitOptions); }));
        var members = properties.concat(methods);
        var node = ts.createInterfaceDeclaration([], modifiers, options.name || interfaceObject.name, genericParameters, heritageClauses, members);
        nodes.push(node);
        this.logger.log("Done emitting interface", interfaceObject);
        return nodes;
    };
    return InterfaceEmitter;
}());
exports.InterfaceEmitter = InterfaceEmitter;
//# sourceMappingURL=InterfaceEmitter.js.map