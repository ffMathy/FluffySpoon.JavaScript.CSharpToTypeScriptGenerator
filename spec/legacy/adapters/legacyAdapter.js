"use strict";
var FileEmitter_1 = require("../../../src/FileEmitter");
function pocoGen(contents, options) {
    var emitter = new FileEmitter_1.FileEmitter(contents);
    return emitter.emitFile({
        namespaceEmitOptions: {
            skip: true
        },
        classEmitOptions: {
            declare: false
        }
    });
}
module.exports = pocoGen;
