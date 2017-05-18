"use strict";
var EnumEmitter_1 = require("./EnumEmitter");
var NamespaceEmitter = (function () {
    function NamespaceEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter);
    }
    NamespaceEmitter.prototype.emitNamespaces = function (namespaces, options) {
        for (var _i = 0, namespaces_1 = namespaces; _i < namespaces_1.length; _i++) {
            var namespace = namespaces_1[_i];
            this.emitNamespace(namespace, options);
        }
    };
    NamespaceEmitter.prototype.emitNamespace = function (namespace, options) {
        if (!options) {
            options = {
                declare: true
            };
        }
        if (namespace.enums.length === 0 && namespace.namespaces.length === 0) {
            return;
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        this.stringEmitter.write("namespace " + namespace.name + " {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        this.enumEmitter.emitEnums(namespace.enums, {
            declare: false
        });
        this.emitNamespaces(namespace.namespaces, {
            declare: false
        });
        this.stringEmitter.removeLastCharacters("\n\n");
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    };
    return NamespaceEmitter;
}());
exports.NamespaceEmitter = NamespaceEmitter;
