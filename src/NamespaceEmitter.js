"use strict";
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter_1 = require("./ClassEmitter");
var InterfaceEmitter_1 = require("./InterfaceEmitter");
var StructEmitter_1 = require("./StructEmitter");
var NamespaceEmitter = (function () {
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
        this.stringEmitter.removeLastNewLines();
        this.logger.log("Done emitting namespaces", namespaces);
    };
    NamespaceEmitter.prototype.emitNamespace = function (namespace, options) {
        if (!options) {
            options = {
                declare: true
            };
        }
        if (namespace.enums.length === 0 && namespace.namespaces.length === 0 && namespace.classes.length === 0 && namespace.interfaces.length === 0) {
            console.log("Skipping namespace " + namespace.name + " because it contains no enums, classes, interfaces or namespaces");
            return;
        }
        this.logger.log("Emitting namespace", namespace);
        if (!options.skip) {
            this.stringEmitter.writeIndentation();
            if (options.declare)
                this.stringEmitter.write("declare ");
            this.stringEmitter.write("namespace " + namespace.name + " {");
            this.stringEmitter.writeLine();
            this.stringEmitter.increaseIndentation();
        }
        if (namespace.enums.length > 0) {
            var namespaceEnumOptions = Object.assign(options.enumEmitOptions || {}, {
                declare: options.skip
            });
            this.enumEmitter.emitEnums(namespace.enums, namespaceEnumOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (namespace.interfaces.length > 0) {
            var declare = typeof options.interfaceEmitOptions.declare !== "undefined" ?
                options.interfaceEmitOptions.declare :
                options.skip;
            var interfaceOptions = Object.assign(options.interfaceEmitOptions, {
                declare: declare
            });
            this.interfaceEmitter.emitInterfaces(namespace.interfaces, interfaceOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (namespace.classes.length > 0) {
            this.classEmitter.emitClasses(namespace.classes, options.classEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (namespace.structs.length > 0) {
            var declare = typeof options.structEmitOptions.declare !== "undefined" ?
                options.structEmitOptions.declare :
                options.skip;
            var structEmitOptions = Object.assign(options.structEmitOptions, {
                declare: declare
            });
            this.structEmitter.emitStructs(namespace.structs, structEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (namespace.namespaces.length > 0) {
            var declare = typeof options.declare !== "undefined" ?
                options.declare :
                options.skip;
            var subNamespaceOptions = Object.assign(options, {
                declare: declare
            });
            this.emitNamespaces(namespace.namespaces, subNamespaceOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (!options.skip) {
            this.stringEmitter.removeLastNewLines();
            this.stringEmitter.decreaseIndentation();
            this.stringEmitter.writeLine();
            this.stringEmitter.writeLine("}");
        }
        this.stringEmitter.ensureLineSplit();
        this.logger.log("Done emitting namespace", namespace);
    };
    return NamespaceEmitter;
}());
exports.NamespaceEmitter = NamespaceEmitter;
