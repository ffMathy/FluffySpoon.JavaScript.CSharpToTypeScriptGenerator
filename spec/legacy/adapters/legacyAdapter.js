"use strict";
var FileEmitter_1 = require("../../../src/FileEmitter");
function pocoGen(contents, options) {
    var emitter = new FileEmitter_1.FileEmitter(contents);
    var emitOptions = {
        namespaceEmitOptions: {
            skip: true
        },
        classEmitOptions: {
            declare: false
        },
        enumEmitOptions: {
            declare: true
        }
    };
    if (options) {
        if (options.useStringUnionTypes) {
            emitOptions.enumEmitOptions.strategy = "string-union";
        }
    }
    return emitter.emitFile(emitOptions);
}
module.exports = pocoGen;
