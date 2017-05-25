"use strict";
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter = (function () {
    function PropertyEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter);
    }
    PropertyEmitter.prototype.emitProperties = function (properties) {
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            this.emitProperty(property);
        }
    };
    PropertyEmitter.prototype.emitProperty = function (property) {
        this.stringEmitter.write(property.name + ": ");
        this.typeEmitter.emitType(property.type);
        this.stringEmitter.write(";");
        this.stringEmitter.writeLine();
    };
    return PropertyEmitter;
}());
exports.PropertyEmitter = PropertyEmitter;
