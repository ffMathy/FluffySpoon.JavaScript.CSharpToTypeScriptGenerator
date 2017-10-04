"use strict";
var FileEmitter_1 = require("../../../src/FileEmitter");
function pocoGen(contents, options) {
    var emitter = new FileEmitter_1.FileEmitter(contents);
    var emitOptions = {
        namespaceEmitOptions: {
            skip: true,
            structEmitOptions: {
                declare: false
            },
            interfaceEmitOptions: {
                declare: false
            }
        },
        classEmitOptions: {
            declare: false,
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
        enumEmitOptions: {
            declare: true
        },
        interfaceEmitOptions: {
            declare: false,
            methodEmitOptions: {
                argumentTypeEmitOptions: {},
                returnTypeEmitOptions: {}
            },
            propertyEmitOptions: {
                typeEmitOptions: {}
            }
        },
        structEmitOptions: {
            declare: false
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
