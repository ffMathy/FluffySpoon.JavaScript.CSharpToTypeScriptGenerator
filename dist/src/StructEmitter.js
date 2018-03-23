"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EnumEmitter_1 = require("./EnumEmitter");
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var FieldEmitter_1 = require("./FieldEmitter");
var MethodEmitter_1 = require("./MethodEmitter");
var ts = require("typescript");
var StructEmitter = /** @class */ (function () {
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
        this.logger.log("Done emitting structs", structs);
    };
    StructEmitter.prototype.emitStruct = function (struct, options) {
        this.logger.log("Emitting struct", struct);
        var node = this.createTypeScriptStructNode(struct, options);
        if (node)
            this.stringEmitter.emitTypeScriptNode(node);
        this.logger.log("Done emitting struct", struct);
    };
    StructEmitter.prototype.createTypeScriptStructNode = function (struct, options) {
        var _this = this;
        options = __assign({}, options, options.perStructEmitOptions(struct));
        if (struct.properties.length === 0 && struct.methods.length === 0 && struct.fields.length === 0) {
            this.logger.log("Skipping interface " + struct.name + " because it contains no properties, fields or methods");
            return null;
        }
        if (!options.filter(struct))
            return null;
        var structName = options.name || struct.name;
        this.logger.log("Emitting interface " + structName);
        var modifiers = new Array();
        if (options.declare)
            modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));
        var fields = struct
            .fields
            .map(function (p) { return _this
            .fieldEmitter
            .createTypeScriptFieldNode(p, options.fieldEmitOptions); });
        var properties = struct
            .properties
            .map(function (p) { return _this
            .propertyEmitter
            .createTypeScriptPropertyNode(p, options.propertyEmitOptions); });
        var node = ts.createInterfaceDeclaration([], modifiers, structName, [], [], properties.concat(fields));
        return node;
    };
    return StructEmitter;
}());
exports.StructEmitter = StructEmitter;
//# sourceMappingURL=StructEmitter.js.map