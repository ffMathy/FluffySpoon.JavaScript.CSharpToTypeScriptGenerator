"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter = (function () {
    function PropertyEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
    }
    PropertyEmitter.prototype.emitProperties = function (properties, options) {
        options = this.prepareOptions(options);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            this.emitProperty(property, options);
        }
    };
    PropertyEmitter.prototype.emitProperty = function (property, options) {
        options = Object.assign(this.prepareOptions(options), options.perPropertyEmitOptions(property));
        if (!options.filter(property))
            return;
        this.stringEmitter.writeIndentation();
        if (options.readOnly)
            this.stringEmitter.write("readonly ");
        this.stringEmitter.write((options.name || property.name) + ": ");
        this.typeEmitter.emitType(property.type, options.typeEmitOptions);
        this.stringEmitter.write(";");
        this.stringEmitter.writeLine();
    };
    PropertyEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (property) { return property.isPublic; };
        }
        if (!options.perPropertyEmitOptions) {
            options.perPropertyEmitOptions = function () { return options; };
        }
        return options;
    };
    return PropertyEmitter;
}());
exports.PropertyEmitter = PropertyEmitter;
