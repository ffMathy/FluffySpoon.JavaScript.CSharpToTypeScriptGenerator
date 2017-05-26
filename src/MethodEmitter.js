"use strict";
var TypeEmitter_1 = require("./TypeEmitter");
var MethodEmitter = (function () {
    function MethodEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter);
    }
    MethodEmitter.prototype.emitMethods = function (methods) {
        for (var _i = 0, methods_1 = methods; _i < methods_1.length; _i++) {
            var method = methods_1[_i];
            this.emitMethod(method);
        }
    };
    MethodEmitter.prototype.emitMethod = function (method) {
        this.stringEmitter.writeIndentation();
        this.stringEmitter.write(method.name + "(");
        this.emitMethodParameters(method.parameters);
        this.stringEmitter.write("): ");
        this.typeEmitter.emitType(method.returnType);
        this.stringEmitter.write(";");
        this.stringEmitter.writeLine();
    };
    MethodEmitter.prototype.emitMethodParameters = function (parameters) {
        for (var _i = 0, parameters_1 = parameters; _i < parameters_1.length; _i++) {
            var parameter = parameters_1[_i];
            this.emitMethodParameter(parameter);
        }
        this.stringEmitter.removeLastCharacters(", ");
    };
    MethodEmitter.prototype.emitMethodParameter = function (parameter) {
        this.stringEmitter.write(parameter.name + ": ");
        this.typeEmitter.emitType(parameter.type);
        this.stringEmitter.write(", ");
    };
    return MethodEmitter;
}());
exports.MethodEmitter = MethodEmitter;
