"use strict";
var FileEmitter_1 = require("../../../src/FileEmitter");
function pocoGen(contents, options) {
    var emitter = new FileEmitter_1.FileEmitter(contents);
    var emitOptions = {
        namespaceEmitOptions: {
            skip: true
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
            emitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions = function (property) { return ({
                name: options.propertyNameResolver(property.name)
            }); };
        }
        if (options.prefixWithI) {
            emitOptions.classEmitOptions.perClassEmitOptions = function (classObject) { return ({
                name: "I" + classObject.name,
                inheritedTypeEmitOptions: {
                    mapper: function (type, suggested) { return "I" + suggested; }
                }
            }); };
        }
        if (options.ignoreVirtual) {
            emitOptions.classEmitOptions.methodEmitOptions.filter = function (method) { return !method.isVirtual; };
            emitOptions.classEmitOptions.propertyEmitOptions.filter = function (property) { return !property.isVirtual; };
        }
        if (options.stripReadOnly) {
            emitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions = function () { return ({
                readOnly: false
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
