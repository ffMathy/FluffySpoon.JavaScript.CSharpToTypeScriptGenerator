"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter_1 = require("./ClassEmitter");
var NamespaceEmitter = (function () {
    function NamespaceEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter);
        this.classEmitter = new ClassEmitter_1.ClassEmitter(stringEmitter);
    }
    NamespaceEmitter.prototype.emitNamespaces = function (namespaces, options) {
        for (var _i = 0, namespaces_1 = namespaces; _i < namespaces_1.length; _i++) {
            var namespace = namespaces_1[_i];
            this.emitNamespace(namespace, options);
        }
        this.stringEmitter.removeLastNewLines();
    };
    NamespaceEmitter.prototype.emitNamespace = function (namespace, options) {
        if (!options) {
            options = {
                declare: true
            };
        }
        if (namespace.enums.length === 0 && namespace.namespaces.length === 0 && namespace.classes.length === 0) {
            console.log("Skipping namespace " + namespace.name + " because it contains no enums, classes or namespaces");
            return;
        }
        console.log("Emitting namespace " + namespace.name);
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
        if (namespace.classes.length > 0) {
            this.classEmitter.emitClasses(namespace.classes, options.classEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }
        if (namespace.namespaces.length > 0) {
            var subNamespaceOptions = Object.assign(options, {
                declare: options.skip
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
    };
    return NamespaceEmitter;
}());
exports.NamespaceEmitter = NamespaceEmitter;
