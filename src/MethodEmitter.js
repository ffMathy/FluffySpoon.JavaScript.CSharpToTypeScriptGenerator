"use strict";
var TypeEmitter_1 = require("./TypeEmitter");
var MethodEmitter = (function () {
    function MethodEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
    }
    MethodEmitter.prototype.emitMethods = function (methods, options) {
        options = this.prepareOptions(options);
        for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
            var method = methods_1[_i];
            this.emitMethod(method, options);
        }
    };
    MethodEmitter.prototype.emitMethod = function (method, options) {
        options = this.prepareOptions(options);
        options = Object.assign(options, options.perMethodEmitOptions(method));
        if (!options.filter(method))
            return;
        if (method.isConstructor)
            return;
        this.stringEmitter.writeIndentation();
        this.stringEmitter.write((options.name || method.name) + "(");
        this.emitMethodParameters(method.parameters, options);
        this.stringEmitter.write("): ");
        this.typeEmitter.emitType(method.returnType, options.returnTypeEmitOptions);
        this.stringEmitter.write(";");
        this.stringEmitter.writeLine();
    };
    MethodEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (method) { return method.isPublic; };
        }
        if (!options.perMethodEmitOptions) {
            options.perMethodEmitOptions = function () { return options; };
        }
        return options;
    };
    MethodEmitter.prototype.emitMethodParameters = function (parameters, options) {
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var parameter = parameters_1[_i];
            this.emitMethodParameter(parameter, options);
        }
        this.stringEmitter.removeLastCharacters(", ");
    };
    MethodEmitter.prototype.emitMethodParameter = function (parameter, options) {
        this.stringEmitter.write(parameter.name + ": ");
        this.typeEmitter.emitType(parameter.type, options.argumentTypeEmitOptions);
        this.stringEmitter.write(", ");
    };
    return MethodEmitter;
}());
exports.MethodEmitter = MethodEmitter;
//# sourceMappingURL=MethodEmitter.js.map