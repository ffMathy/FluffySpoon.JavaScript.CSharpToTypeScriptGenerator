"use strict";
var EnumEmitter_1 = require("./EnumEmitter");
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var FieldEmitter_1 = require("./FieldEmitter");
var MethodEmitter_1 = require("./MethodEmitter");
var StructEmitter = (function () {
    function StructEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter, logger);
        this.propertyEmitter = new PropertyEmitter_1.PropertyEmitter(stringEmitter, logger);
        this.fieldEmitter = new FieldEmitter_1.FieldEmitter(stringEmitter, logger);
        this.methodEmitter = new MethodEmitter_1.MethodEmitter(stringEmitter, logger);
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
    }
    StructEmitter.prototype.emitStructs = function (structs, options) {
        this.logger.log("Emitting structs", structs);
        for (var _i = 0, structs_1 = structs; _i < structs_1.length; _i++) {
            var struct = structs_1[_i];
            this.emitStruct(struct, options);
        }
        this.stringEmitter.removeLastNewLines();
        this.logger.log("Done emitting structs", structs);
    };
    StructEmitter.prototype.emitStruct = function (struct, options) {
        this.logger.log("Emitting struct", struct);
        options = this.prepareOptions(options);
        options = Object.assign(options, options.perStructEmitOptions(struct));
        this.emitStructInterface(struct, options);
        this.stringEmitter.ensureNewParagraph();
        this.logger.log("Done emitting struct", struct);
    };
    StructEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (struct) { return struct.isPublic; };
        }
        if (!options.perStructEmitOptions) {
            options.perStructEmitOptions = function () { return options; };
        }
        return options;
    };
    StructEmitter.prototype.emitStructInterface = function (struct, options) {
        if (struct.properties.length === 0 && struct.methods.length === 0 && struct.fields.length === 0) {
            this.logger.log("Skipping interface " + struct.name + " because it contains no properties, fields or methods");
            return;
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        var className = options.name || struct.name;
        this.logger.log("Emitting interface " + className);
        this.stringEmitter.write("interface " + className);
        this.stringEmitter.write(" {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        if (struct.fields.length > 0) {
            this.fieldEmitter.emitFields(struct.fields, options.fieldEmitOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        if (struct.properties.length > 0) {
            this.propertyEmitter.emitProperties(struct.properties, options.propertyEmitOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        if (struct.methods.length > 0) {
            this.methodEmitter.emitMethods(struct.methods, options.methodEmitOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        this.stringEmitter.removeLastNewLines();
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.ensureNewParagraph();
    };
    return StructEmitter;
}());
exports.StructEmitter = StructEmitter;
//# sourceMappingURL=StructEmitter.js.map