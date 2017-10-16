"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var EnumEmitter = /** @class */ (function () {
    function EnumEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
    }
    EnumEmitter.prototype.emitEnums = function (enums, options) {
        this.logger.log("Emitting enums", enums);
        for (var _i = 0, enums_1 = enums; _i < enums_1.length; _i++) {
            var enumObject = enums_1[_i];
            this.emitEnum(enumObject, options);
        }
        this.logger.log("Done emitting enums", enums);
    };
    EnumEmitter.prototype.emitEnum = function (enumObject, options) {
        var node = this.createTypeScriptEnumNode(enumObject, options);
        if (!node)
            return;
        this.stringEmitter.emitTypeScriptNode(node);
    };
    EnumEmitter.prototype.createTypeScriptEnumNode = function (enumObject, options) {
        if (!options.filter(enumObject))
            return null;
        this.logger.log("Emitting enum", enumObject);
        var modifiers = new Array();
        if (options.declare)
            modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));
        var node;
        if (options.strategy === "string-union") {
            node = ts.createTypeAliasDeclaration([], modifiers, enumObject.name, [], ts.createUnionOrIntersectionTypeNode(ts.SyntaxKind.UnionType, enumObject
                .options
                .map(function (v) { return ts.createTypeReferenceNode(ts.createIdentifier("'" + v.name + "'"), []); })));
        }
        else {
            node = ts.createEnumDeclaration([], modifiers, enumObject.name, enumObject
                .options
                .map(function (v) { return ts.createEnumMember(v.name, v.value ? ts.createNumericLiteral(v.value.toString()) : null); }));
        }
        this.logger.log("Done emitting enum", enumObject);
        return node;
    };
    return EnumEmitter;
}());
exports.EnumEmitter = EnumEmitter;
//# sourceMappingURL=EnumEmitter.js.map