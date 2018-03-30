"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var ts = require("typescript");
var OptionsHelper_1 = require("./OptionsHelper");
var MethodEmitter = /** @class */ (function () {
    function MethodEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
        this.optionsHelper = new OptionsHelper_1.OptionsHelper();
    }
    MethodEmitter.prototype.emitMethods = function (methods, options) {
        for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
            var method = methods_1[_i];
            this.emitMethod(method, options);
        }
    };
    MethodEmitter.prototype.emitMethod = function (method, options) {
        var node = this.createTypeScriptMethodNode(method, options);
        if (!node)
            return;
        this.stringEmitter.emitTypeScriptNode(node);
    };
    MethodEmitter.prototype.createTypeScriptMethodNode = function (method, options) {
        if (options.perMethodEmitOptions)
            options = this.optionsHelper.mergeOptionsRecursively(options.perMethodEmitOptions(method), options);
        if (!options.filter(method))
            return null;
        if (method.isConstructor)
            return null;
        var modifiers = new Array();
        var node = ts.createMethodSignature([], this.createTypeScriptMethodParameterNodes(method.parameters, options), this.typeEmitter.createTypeScriptTypeReferenceNode(method.returnType, options.returnTypeEmitOptions), options.name || method.name, null);
        return node;
    };
    MethodEmitter.prototype.createTypeScriptMethodParameterNodes = function (parameters, options) {
        var nodes = new Array();
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var parameter = parameters_1[_i];
            nodes.push(this.createTypeScriptMethodParameterNode(parameter, options));
        }
        return nodes;
    };
    MethodEmitter.prototype.createTypeScriptMethodParameterNode = function (parameter, options) {
        var initializer = null;
        if (parameter.defaultValue)
            initializer = ts.createLiteral(parameter.defaultValue);
        var node = ts.createParameter([], [], null, options.name || parameter.name, null, this.typeEmitter.createTypeScriptTypeReferenceNode(parameter.type, options.argumentTypeEmitOptions), initializer);
        return node;
    };
    return MethodEmitter;
}());
exports.MethodEmitter = MethodEmitter;
//# sourceMappingURL=MethodEmitter.js.map