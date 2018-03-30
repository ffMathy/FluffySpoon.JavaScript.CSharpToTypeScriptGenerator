"use strict";
var Emitter_1 = require("../../../src/Emitter");
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
Error.stackTraceLimit = 100;
function LegacyAdapter(contents, options) {
    var emitter = new Emitter_1.Emitter(contents);
    var emitOptions = {
        defaults: {
            namespaceEmitOptions: {
                skip: true
            },
            fieldEmitOptions: {
                perFieldEmitOptions: function (field) { return ({
                    readOnly: field.isReadOnly,
                    name: field.name
                }); }
            },
            propertyEmitOptions: {
                perPropertyEmitOptions: function (property) { return ({
                    name: property.name
                }); }
            },
            structEmitOptions: {
                perStructEmitOptions: function (struct) { return ({
                    name: struct.name
                }); }
            },
            methodEmitOptions: {},
            enumEmitOptions: {},
            interfaceEmitOptions: {
                filter: function (interfaceObject) { return false; }
            },
            classEmitOptions: {}
        },
        file: {
            namespaceEmitOptions: {
                classEmitOptions: {
                    propertyEmitOptions: {
                        typeEmitOptions: {}
                    },
                    methodEmitOptions: {
                        returnTypeEmitOptions: {},
                        argumentTypeEmitOptions: {}
                    },
                    structEmitOptions: {
                        fieldEmitOptions: {},
                        methodEmitOptions: {},
                        propertyEmitOptions: {}
                    }
                }
            },
            classEmitOptions: {
                propertyEmitOptions: {
                    typeEmitOptions: {}
                },
                methodEmitOptions: {
                    returnTypeEmitOptions: {},
                    argumentTypeEmitOptions: {}
                },
                structEmitOptions: {
                    fieldEmitOptions: {},
                    methodEmitOptions: {},
                    propertyEmitOptions: {}
                }
            },
            interfaceEmitOptions: {
                propertyEmitOptions: {}
            },
            structEmitOptions: {
                propertyEmitOptions: {},
                methodEmitOptions: {},
                fieldEmitOptions: {}
            }
        }
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
        if (options.includeInterfaces) {
            emitOptions.defaults.interfaceEmitOptions.filter = function () { return true; };
        }
        if (options.useStringUnionTypes) {
            emitOptions.defaults.enumEmitOptions.strategy = "string-union";
        }
        if (options.propertyNameResolver) {
            emitOptions.defaults.propertyEmitOptions.perPropertyEmitOptions =
                emitOptions.defaults.propertyEmitOptions.perPropertyEmitOptions = function (property) { return ({
                    name: options.propertyNameResolver(property.name)
                }); };
        }
        if (options.methodNameResolver) {
            emitOptions.defaults.methodEmitOptions.perMethodEmitOptions =
                emitOptions.defaults.methodEmitOptions.perMethodEmitOptions = function (method) { return ({
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
            emitOptions.defaults.interfaceEmitOptions.perInterfaceEmitOptions =
                emitOptions.defaults.classEmitOptions.perClassEmitOptions = perInterfaceOrClassOptions;
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
            emitOptions.defaults.classEmitOptions.perClassEmitOptions =
                emitOptions.defaults.interfaceEmitOptions.perInterfaceEmitOptions = perInterfaceOrClassOptions;
        }
        if (options.ignoreVirtual) {
            emitOptions.defaults.methodEmitOptions.filter = function (method) { return !method.isVirtual; };
            emitOptions.defaults.propertyEmitOptions.filter = function (property) { return !property.isVirtual; };
        }
        if (options.ignoreMethods) {
            emitOptions.defaults.methodEmitOptions.filter = function (method) { return false; };
        }
        if (options.stripReadOnly) {
            emitOptions.defaults.fieldEmitOptions.perFieldEmitOptions = function () { return ({
                readOnly: false
            }); };
        }
        if (options.ignoreInheritance) {
            emitOptions.file.interfaceEmitOptions.filter = function (classObject) { return options.ignoreInheritance.indexOf(classObject.name) === -1; };
            emitOptions.file.interfaceEmitOptions.perInterfaceEmitOptions = function (interfaceObject) { return ({
                inheritedTypeEmitOptions: {
                    filter: function (type) { return options.ignoreInheritance.indexOf(type.name) === -1; }
                }
            }); };
            emitOptions.file.classEmitOptions.filter = function (classObject) { return options.ignoreInheritance.indexOf(classObject.name) === -1; };
            emitOptions.file.classEmitOptions.perClassEmitOptions = function (classObject) { return ({
                inheritedTypeEmitOptions: {
                    filter: function (type) { return options.ignoreInheritance.indexOf(type.name) === -1; }
                }
            }); };
        }
        if (options.baseNamespace) {
            emitOptions.file.namespaceEmitOptions.skip = false;
            emitOptions.file.namespaceEmitOptions.declare = true;
            emitOptions.onAfterParsing = function (file) {
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
            emitOptions.defaults.typeEmitOptions = {
                mapper: function (type, suggested) { return type.name === "DateTime" ? "Date" : suggested; }
            };
        }
        if (options.customTypeTranslations) {
            emitOptions.defaults.typeEmitOptions = {
                mapper: function (type, suggested) { return options.customTypeTranslations[type.name] || suggested; }
            };
        }
        if (options.typeResolver) {
            emitOptions.file.classEmitOptions
                .propertyEmitOptions
                .typeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "property-type"); };
            emitOptions.file.namespaceEmitOptions
                .classEmitOptions
                .propertyEmitOptions
                .typeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "property-type"); };
            emitOptions.file.classEmitOptions
                .methodEmitOptions
                .returnTypeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "method-return-type"); };
            emitOptions.file.namespaceEmitOptions
                .classEmitOptions
                .methodEmitOptions
                .returnTypeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "method-return-type"); };
            emitOptions.file.classEmitOptions
                .methodEmitOptions
                .argumentTypeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "method-argument-type"); };
            emitOptions.file.namespaceEmitOptions
                .classEmitOptions
                .methodEmitOptions
                .argumentTypeEmitOptions
                .mapper = function (type, suggested) { return options.typeResolver(suggested, "method-argument-type"); };
        }
    }
    return emitter.emit(emitOptions);
}
module.exports = LegacyAdapter;
//# sourceMappingURL=legacyAdapter.js.map