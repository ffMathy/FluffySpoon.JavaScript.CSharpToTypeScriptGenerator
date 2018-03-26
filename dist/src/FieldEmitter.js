"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var ts = require("typescript");
var OptionsHelper_1 = require("./OptionsHelper");
var FieldEmitter = /** @class */ (function () {
    function FieldEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
        this.optionsHelper = new OptionsHelper_1.OptionsHelper();
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
        options = this.optionsHelper.mergeOptionsRecursively(options.perFieldEmitOptions(field), options);
        if (!options.filter(field))
            return null;
        this.logger.log("Emitting field", field);
        var modifiers = new Array();
        if ((typeof options.readOnly !== "boolean" || options.readOnly) && field.isReadOnly)
            modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));
        var node = ts.createPropertySignature(modifiers, options.name || field.name, field.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null, this.typeEmitter.createTypeScriptTypeReferenceNode(field.type, options.typeEmitOptions), null);
        this.logger.log("Done emitting field", field);
        return node;
    };
    return FieldEmitter;
}());
exports.FieldEmitter = FieldEmitter;
//# sourceMappingURL=FieldEmitter.js.map