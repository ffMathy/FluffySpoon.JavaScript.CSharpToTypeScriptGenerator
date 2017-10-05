"use strict";
var TypeEmitter_1 = require("./TypeEmitter");
var FieldEmitter = (function () {
    function FieldEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
    }
    FieldEmitter.prototype.emitFields = function (fields, options) {
        options = this.prepareOptions(options);
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var property = fields_1[_i];
            this.emitField(property, options);
        }
        this.stringEmitter.removeLastNewLines();
    };
    FieldEmitter.prototype.emitField = function (field, options) {
        options = Object.assign(this.prepareOptions(options), options.perFieldEmitOptions(field));
        if (!options.filter(field))
            return;
        this.logger.log("Emitting field " + field.name);
        this.stringEmitter.writeIndentation();
        if (options.readOnly)
            this.stringEmitter.write("readonly ");
        this.stringEmitter.write((options.name || field.name) + ": ");
        this.typeEmitter.emitType(field.type, options.typeEmitOptions);
        this.stringEmitter.write(";");
        this.stringEmitter.ensureNewLine();
    };
    FieldEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (field) { return field.isPublic; };
        }
        if (!options.perFieldEmitOptions) {
            options.perFieldEmitOptions = function () { return options; };
        }
        return options;
    };
    return FieldEmitter;
}());
exports.FieldEmitter = FieldEmitter;
//# sourceMappingURL=FieldEmitter.js.map