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
            }
        },
        enumEmitOptions: {
            declare: true
        }
    };
    if (options) {
        if (options.useStringUnionTypes) {
            emitOptions.enumEmitOptions.strategy = "string-union";
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
