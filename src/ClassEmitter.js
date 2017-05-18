"use strict";
var EnumEmitter_1 = require("./EnumEmitter");
var ClassEmitter = (function () {
    function ClassEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter);
    }
    ClassEmitter.prototype.emitClasses = function (classes) {
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var classObject = classes_1[_i];
            this.emitClass(classObject);
        }
    };
    ClassEmitter.prototype.emitClass = function (classObject) {
        this.stringEmitter.writeLine("declare namespace " + classObject.fullName + " {");
        this.stringEmitter.increaseIndentation();
        this.enumEmitter.emitEnums(classObject.enums, {
            declare: false
        });
        this.stringEmitter.removeLastCharacters("\n\n");
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    };
    return ClassEmitter;
}());
exports.ClassEmitter = ClassEmitter;
