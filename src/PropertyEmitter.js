"use strict";
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter = (function () {
    function PropertyEmitter(stringEmitter) {
        this.stringEmitter = stringEmitter;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter);
    }
    PropertyEmitter.prototype.emitProperties = function (properties, options) {
        options = this.prepareOptions(options);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            this.emitProperty(property, options);
        }
    };
    PropertyEmitter.prototype.emitProperty = function (property, options) {
        options = this.prepareOptions(options);
        this.stringEmitter.writeIndentation();
        this.stringEmitter.write(property.name + ": ");
        this.typeEmitter.emitType(property.type, options.typeEmitOptions);
        this.stringEmitter.write(";");
        this.stringEmitter.writeLine();
    };
    PropertyEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        return options;
    };
    return PropertyEmitter;
}());
exports.PropertyEmitter = PropertyEmitter;
