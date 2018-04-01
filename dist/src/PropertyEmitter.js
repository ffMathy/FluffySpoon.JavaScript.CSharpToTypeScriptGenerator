"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var ts = require("typescript");
var OptionsHelper_1 = require("./OptionsHelper");
var PropertyEmitter = /** @class */ (function () {
    function PropertyEmitter(typeScriptEmitter, logger) {
        this.typeScriptEmitter = typeScriptEmitter;
        this.logger = logger;
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(typeScriptEmitter, logger);
        this.optionsHelper = new OptionsHelper_1.OptionsHelper();
    }
    PropertyEmitter.prototype.emitProperties = function (properties, options) {
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            this.emitProperty(property, options);
        }
    };
    PropertyEmitter.prototype.emitProperty = function (property, options) {
        var node = this.createTypeScriptPropertyNode(property, options);
        if (!node)
            return;
        this.typeScriptEmitter.emitTypeScriptNode(node);
    };
    PropertyEmitter.prototype.createTypeScriptPropertyNode = function (property, options) {
        if (options.perPropertyEmitOptions)
            options = this.optionsHelper.mergeOptionsRecursively(options.perPropertyEmitOptions(property), options);
        if (!options.filter(property))
            return;
        var modifiers = new Array();
        if ((typeof options.readOnly !== "boolean" || options.readOnly) && property.isReadOnly)
            modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));
        var node = ts.createPropertySignature(modifiers, options.name || property.name, property.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null, this.typeEmitter.createTypeScriptTypeReferenceNode(property.type, options.typeEmitOptions), null);
        return node;
    };
    return PropertyEmitter;
}());
exports.PropertyEmitter = PropertyEmitter;
//# sourceMappingURL=PropertyEmitter.js.map