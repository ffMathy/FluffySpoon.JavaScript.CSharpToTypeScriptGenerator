"use strict";
var EnumEmitter_1 = require("./EnumEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var ClassEmitter = (function () {
    function ClassEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter);
        this.propertyEmitter = new PropertyEmitter_1.PropertyEmitter(stringEmitter);
    }
    ClassEmitter.prototype.emitClasses = function (classes, options) {
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var classObject = classes_1[_i];
            this.emitClass(classObject, options);
        }
    };
    ClassEmitter.prototype.emitClass = function (classObject, options) {
        if (!options) {
            options = {
                declare: true
            };
        }
        this.emitEnumsInClass(classObject, options);
        this.emitClassInterface(classObject, options);
    };
    ClassEmitter.prototype.emitClassInterface = function (classObject, options) {
        if (classObject.properties.length === 0) {
            return;
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        this.stringEmitter.write("interface " + classObject.name + " {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        this.propertyEmitter.emitProperties(classObject.properties);
        this.stringEmitter.removeLastCharacters("\n");
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    };
    ClassEmitter.prototype.emitEnumsInClass = function (classObject, options) {
        if (classObject.enums.length === 0) {
            return;
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        this.stringEmitter.write("namespace " + classObject.name + " {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        this.enumEmitter.emitEnums(classObject.enums, {
            declare: false
        });
        this.emitClasses(classObject.classes, {
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
