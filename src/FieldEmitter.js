"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var ts = require("typescript");
var FieldEmitter = /** @class */ (function () {
    function FieldEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
    }
    FieldEmitter.prototype.emitFields = function (fields, options) {
        for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
            var property = fields_1[_i];
            this.emitField(property, options);
        }
        this.stringEmitter.removeLastNewLines();
    };
    FieldEmitter.prototype.emitField = function (field, options) {
        var node = this.createTypeScriptFieldNode(field, options);
        if (!node)
            return;
        this.stringEmitter.emitTypeScriptNode(node);
    };
    FieldEmitter.prototype.createTypeScriptFieldNode = function (field, options) {
        options = Object.assign(this.prepareOptions(options), options.perFieldEmitOptions(field));
        if (!options.filter(field))
            return;
        this.logger.log("Emitting field " + field.name);
        var modifiers = new Array();
        if (options.readOnly)
            modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));
        var node = ts.createPropertySignature(modifiers, options.name || field.name, field.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null, this.typeEmitter.createTypeScriptTypeReferenceNode(field.type, options.typeEmitOptions), null);
        return node;
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