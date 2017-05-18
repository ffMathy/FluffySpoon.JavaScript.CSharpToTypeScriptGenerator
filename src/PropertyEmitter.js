"use strict";
var PropertyEmitter = (function () {
    function PropertyEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
    }
    PropertyEmitter.prototype.emitProperties = function (properties) {
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            this.emitProperty(property);
        }
    };
    PropertyEmitter.prototype.emitProperty = function (property) {
        this.stringEmitter.writeLine(property.name + ": " + property.type.name + ";");
    };
    return PropertyEmitter;
}());
exports.PropertyEmitter = PropertyEmitter;
