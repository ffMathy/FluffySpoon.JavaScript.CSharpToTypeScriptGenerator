"use strict";
var FileEmitter_1 = require("../../../src/FileEmitter");
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
function pocoGen(contents, options) {
    var emitter = new FileEmitter_1.FileEmitter(contents);
    var emitOptions = {
        namespaceEmitOptions: {
            skip: true
        },
        classEmitOptions: {
            propertyEmitOptions: {
                typeEmitOptions: {}
            },
            methodEmitOptions: {
                argumentTypeEmitOptions: {},
                returnTypeEmitOptions: {}
            },
            fieldEmitOptions: {
                perFieldEmitOptions: function (field) { return ({
                    readOnly: field.isReadOnly
                }); }
            }
        },
        enumEmitOptions: {},
        interfaceEmitOptions: {
            methodEmitOptions: {
                argumentTypeEmitOptions: {},
                returnTypeEmitOptions: {}
            },
            propertyEmitOptions: {
                typeEmitOptions: {}
            }
        },
        structEmitOptions: {}
    };
    emitter.logger.setLogMethod(function (message) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        if (parameters.length > 0) {
            console.log(emitter.stringEmitter.currentIndentation + message, parameters);
        }
        else {
            console.log(emitter.stringEmitter.currentIndentation + message);
        }
    });
    if (options) {
        if (options.useStringUnionTypes) {
            emitOptions.enumEmitOptions.strategy = "string-union";
        }
        if (options.propertyNameResolver) {
            emitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions =
                emitOptions.interfaceEmitOptions.propertyEmitOptions.perPropertyEmitOptions = function (property) { return ({
                    name: options.propertyNameResolver(property.name)
                }); };
        }
        if (options.methodNameResolver) {
            emitOptions.interfaceEmitOptions.methodEmitOptions.perMethodEmitOptions =
                emitOptions.classEmitOptions.methodEmitOptions.perMethodEmitOptions = function (method) { return ({
                    name: options.methodNameResolver(method.name)
                }); };
        }
        var perInterfaceOrClassOptions = function (input) { return ({
            name: input.name,
            inheritedTypeEmitOptions: {
                mapper: function (type, suggestedOutput) { return suggestedOutput; }
            }
        }); };
        if (options.interfaceNameResolver) {
            perInterfaceOrClassOptions = function (interfaceObject) { return ({
                name: options.interfaceNameResolver(interfaceObject.name),
                inheritedTypeEmitOptions: {
                    mapper: function (type, suggestedOutput) { return options.interfaceNameResolver(suggestedOutput); }
                }
            }); };
            emitOptions.interfaceEmitOptions.perInterfaceEmitOptions =
                emitOptions.classEmitOptions.perClassEmitOptions = perInterfaceOrClassOptions;
        }
        if (options.prefixWithI) {
            var prefixWithIPerInterfaceOrClassOptions = perInterfaceOrClassOptions;
            perInterfaceOrClassOptions = function (classObject) { return ({
                name: "I" + prefixWithIPerInterfaceOrClassOptions(classObject).name,
                inheritedTypeEmitOptions: {
                    mapper: function (type, suggested) {
                        return "I" + prefixWithIPerInterfaceOrClassOptions(classObject).inheritedTypeEmitOptions.mapper(type, suggested);
                    }
                }
            }); };
            emitOptions.classEmitOptions.perClassEmitOptions =
                emitOptions.interfaceEmitOptions.perInterfaceEmitOptions = perInterfaceOrClassOptions;
        }
        if (options.ignoreVirtual) {
            emitOptions.classEmitOptions.methodEmitOptions.filter = function (method) { return !method.isVirtual; };
            emitOptions.classEmitOptions.propertyEmitOptions.filter = function (property) { return !property.isVirtual; };
        }
        if (options.ignoreMethods) {
            emitOptions.classEmitOptions.methodEmitOptions.filter = function (method) { return false; };
        }
        if (options.stripReadOnly) {
            emitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions = function () { return ({
                readOnly: false
            }); };
        }
        if (options.ignoreInheritance) {
            emitOptions.interfaceEmitOptions.filter = function (classObject) { return options.ignoreInheritance.indexOf(classObject.name) === -1; };
            emitOptions.classEmitOptions.filter = function (classObject) { return options.ignoreInheritance.indexOf(classObject.name) === -1; };
            emitOptions.classEmitOptions.perClassEmitOptions = function (classObject) { return ({
                inheritedTypeEmitOptions: {
                    filter: function (type) { return options.ignoreInheritance.indexOf(type.name) === -1; }
                }
            }); };
        }
        if (options.baseNamespace) {
            emitOptions.namespaceEmitOptions.skip = false;
            emitOptions.namespaceEmitOptions.declare = true;
            emitOptions.classEmitOptions.declare = false;
            emitOptions.enumEmitOptions.declare = false;
            emitOptions.interfaceEmitOptions.declare = false;
            emitOptions.structEmitOptions.declare = false;
            emitOptions.afterParsing = function (file) {
                if (file.namespaces.filter(function (n) { return n.name === options.baseNamespace; })[0])
                    return;
                var namespace = new fluffy_spoon_javascript_csharp_parser_1.CSharpNamespace(options.baseNamespace);
                namespace.classes = file.classes;
                namespace.enums = file.enums;
                namespace.innerScopeText = file.innerScopeText;
                namespace.interfaces = file.interfaces;
                namespace.namespaces = file.namespaces;
                namespace.parent = file;
                namespace.structs = file.structs;
                namespace.usings = file.usings;
                file.classes = [];
                file.enums = [];
                file.interfaces = [];
                file.namespaces = [];
                file.structs = [];
                file.usings = [];
                file.namespaces.push(namespace);
            };
        }
        if (options.dateTimeToDate) {
            emitOptions.typeEmitOptions = {
                mapper: function (type, suggested) { return type.name === "DateTime" ? "Date" : suggested; }
            };
        }
        if (options.customTypeTranslations) {
            emitOptions.typeEmitOptions = {
                mapper: function (type, suggested) { return options.customTypeTranslations[type.name] || suggested; }
            };
        }
        if (options.typeResolver) {
            emitOptions.classEmitOptions
                .propertyEmitOptions
                .typeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "property-type"); };
            emitOptions.classEmitOptions
                .methodEmitOptions
                .returnTypeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "method-return-type"); };
            emitOptions.classEmitOptions
                .methodEmitOptions
                .argumentTypeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "method-argument-type"); };
        }
    }
    return emitter.emitFile(emitOptions);
}
module.exports = pocoGen;
