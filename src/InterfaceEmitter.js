"use strict";
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var MethodEmitter_1 = require("./MethodEmitter");
var InterfaceEmitter = (function () {
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
        options = this.prepareOptions(options);
        options = Object.assign(options, options.perInterfaceEmitOptions(interfaceObject));
        if (!options.filter(interfaceObject))
            return;
        this.logger.log("Emitting interface", interfaceObject);
        this.emitClassInterface(interfaceObject, options);
        this.stringEmitter.ensureNewParagraph();
        this.logger.log("Done emitting interface", interfaceObject);
    };
    InterfaceEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function () { return true; };
        }
        if (!options.perInterfaceEmitOptions) {
            options.perInterfaceEmitOptions = function () { return options; };
        }
        return options;
    };
    InterfaceEmitter.prototype.emitClassInterface = function (interfaceObject, options) {
        if (interfaceObject.properties.length === 0 && interfaceObject.methods.length === 0) {
            this.logger.log("Skipping interface " + interfaceObject.name + " because it contains no properties or methods");
            return;
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        var className = options.name || interfaceObject.name;
        this.logger.log("Emitting interface " + className);
        this.stringEmitter.write("interface " + className);
        if (interfaceObject.genericParameters)
            this.typeEmitter.emitGenericParameters(interfaceObject.genericParameters, options.genericParameterTypeEmitOptions);
        if (interfaceObject.inheritsFrom && this.typeEmitter.canEmitType(interfaceObject.inheritsFrom, options.inheritedTypeEmitOptions)) {
            this.stringEmitter.write(" extends ");
            this.typeEmitter.emitType(interfaceObject.inheritsFrom, options.inheritedTypeEmitOptions);
        }
        this.stringEmitter.write(" {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        if (interfaceObject.properties.length > 0) {
            this.propertyEmitter.emitProperties(interfaceObject.properties, options.propertyEmitOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        if (interfaceObject.methods.length > 0) {
            this.methodEmitter.emitMethods(interfaceObject.methods, options.methodEmitOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        this.stringEmitter.removeLastNewLines();
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.ensureNewParagraph();
    };
    return InterfaceEmitter;
}());
exports.InterfaceEmitter = InterfaceEmitter;
//# sourceMappingURL=InterfaceEmitter.js.map