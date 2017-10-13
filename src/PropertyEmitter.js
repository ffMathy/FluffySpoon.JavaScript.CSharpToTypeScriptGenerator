"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEmitter_1 = require("./TypeEmitter");
var ts = require("typescript");
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
        var node = this.createTypeScriptPropertyNode(property, options);
        if (node)
            this.stringEmitter.emitTypeScriptNode(node);
    };
    PropertyEmitter.prototype.createTypeScriptPropertyNode = function (property, options) {
        options = this.prepareOptions(options);
        options = Object.assign(options, options.perPropertyEmitOptions(property));
        if (!options.filter(property))
            return;
        var modifiers = new Array();
        if (options.readOnly)
            modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));
        var node = ts.createPropertySignature(modifiers, options.name || property.name, property.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null, this.typeEmitter.createTypeScriptTypeReferenceNode(property.type, options.typeEmitOptions), null);
        return node;
    };
    PropertyEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (property) { return property.isPublic; };
        }
        if (!options.perPropertyEmitOptions) {
            options.perPropertyEmitOptions = function (property) { return ({
                name: property.name.charAt(0).toLowerCase() + property.name.substring(1)
            }); };
        }
        return options;
    };
    return PropertyEmitter;
}());
exports.PropertyEmitter = PropertyEmitter;
//# sourceMappingURL=PropertyEmitter.js.map