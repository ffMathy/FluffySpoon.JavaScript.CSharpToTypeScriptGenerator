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
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var EnumEmitter_1 = require("./EnumEmitter");
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var InterfaceEmitter_1 = require("./InterfaceEmitter");
var FieldEmitter_1 = require("./FieldEmitter");
var MethodEmitter_1 = require("./MethodEmitter");
var NamespaceEmitter_1 = require("./NamespaceEmitter");
var ts = require("typescript");
var OptionsHelper_1 = require("./OptionsHelper");
var ClassEmitter = /** @class */ (function () {
    function ClassEmitter(stringEmitter, logger) {
        this.stringEmitter = stringEmitter;
        this.logger = logger;
        this.enumEmitter = new EnumEmitter_1.EnumEmitter(stringEmitter, logger);
        this.propertyEmitter = new PropertyEmitter_1.PropertyEmitter(stringEmitter, logger);
        this.fieldEmitter = new FieldEmitter_1.FieldEmitter(stringEmitter, logger);
        this.methodEmitter = new MethodEmitter_1.MethodEmitter(stringEmitter, logger);
        this.typeEmitter = new TypeEmitter_1.TypeEmitter(stringEmitter, logger);
        this.interfaceEmitter = new InterfaceEmitter_1.InterfaceEmitter(stringEmitter, logger);
        this.optionsHelper = new OptionsHelper_1.OptionsHelper();
    }
    ClassEmitter.prototype.emitClasses = function (classes, options) {
        this.logger.log("Emitting classes", classes);
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var classObject = classes_1[_i];
            this.emitClass(classObject, options);
        }
        this.logger.log("Done emitting classes", classes);
    };
    ClassEmitter.prototype.emitClass = function (classObject, options) {
        var nodes = this.createTypeScriptClassNodes(classObject, options);
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            this.stringEmitter.emitTypeScriptNode(node);
        }
    };
    ClassEmitter.prototype.createTypeScriptClassNodes = function (classObject, options) {
        var _this = this;
        if (options.perClassEmitOptions)
            options = this.optionsHelper.mergeOptionsRecursively(options.perClassEmitOptions(classObject), options);
        if (!options.filter(classObject)) {
            return [];
        }
        var hasNestedChildren = classObject.interfaces.length > 0 ||
            classObject.classes.length > 0 ||
            classObject.structs.length > 0 ||
            classObject.enums.length > 0;
        var hasDirectChildren = classObject.properties.length > 0 ||
            classObject.methods.length > 0 ||
            classObject.fields.length > 0;
        if (!hasDirectChildren && !hasNestedChildren) {
            this.logger.log("Skipping emitting body of class " + classObject.name + " because it contains no children");
            return [];
        }
        this.logger.log("Emitting class", classObject);
        var nodes = new Array();
        if (hasDirectChildren) {
            var modifiers = new Array();
            if (options.declare)
                modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));
            var heritageClauses = new Array();
            if (classObject.inheritsFrom && this.typeEmitter.canEmitType(classObject.inheritsFrom, options.inheritedTypeEmitOptions))
                heritageClauses.push(ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword, [this.typeEmitter.createTypeScriptExpressionWithTypeArguments(classObject.inheritsFrom, options.inheritedTypeEmitOptions)]));
            var properties = classObject
                .properties
                .map(function (x) { return _this
                .propertyEmitter
                .createTypeScriptPropertyNode(x, options.propertyEmitOptions); });
            var methods = classObject
                .methods
                .map(function (x) { return _this
                .methodEmitter
                .createTypeScriptMethodNode(x, options.methodEmitOptions); });
            var genericParameters = new Array();
            if (classObject.genericParameters)
                genericParameters = genericParameters.concat(classObject
                    .genericParameters
                    .map(function (x) { return _this
                    .typeEmitter
                    .createTypeScriptTypeParameterDeclaration(x, options.genericParameterTypeEmitOptions); }));
            var fields = classObject
                .fields
                .map(function (x) { return _this
                .fieldEmitter
                .createTypeScriptFieldNode(x, options.fieldEmitOptions); });
            var classMembers = fields.concat(properties, methods);
            var node = ts.createInterfaceDeclaration([], modifiers, options.name || classObject.name, genericParameters, heritageClauses, classMembers);
            nodes.push(node);
        }
        if (hasNestedChildren) {
            var wrappedNamespace = new fluffy_spoon_javascript_csharp_parser_1.CSharpNamespace(options.name || classObject.name);
            wrappedNamespace.classes = classObject.classes;
            wrappedNamespace.enums = classObject.enums;
            wrappedNamespace.interfaces = classObject.interfaces;
            wrappedNamespace.structs = classObject.structs;
            if (classObject.parent instanceof fluffy_spoon_javascript_csharp_parser_1.CSharpFile || classObject.parent instanceof fluffy_spoon_javascript_csharp_parser_1.CSharpNamespace)
                wrappedNamespace.parent = classObject.parent;
            classObject.classes = [];
            classObject.enums = [];
            classObject.interfaces = [];
            classObject.structs = [];
            classObject.parent = wrappedNamespace;
            var namespaceEmitter = new NamespaceEmitter_1.NamespaceEmitter(this.stringEmitter, this.logger);
            var declareObject = {
                declare: false
            };
            var namespaceOptions = {
                classEmitOptions: __assign({}, options, { declare: false, nestingLevel: options.nestingLevel + 1 }),
                enumEmitOptions: __assign({}, options.enumEmitOptions, { declare: false }),
                interfaceEmitOptions: __assign({}, options.interfaceEmitOptions, { declare: false }),
                structEmitOptions: __assign({}, options.structEmitOptions, { declare: false }),
                filter: function () { return true; },
                skip: false,
                declare: options.nestingLevel === 0 ? options.declare : false,
                nestingLevel: options.nestingLevel,
            };
            var namespaceNodes = namespaceEmitter.createTypeScriptNamespaceNodes(wrappedNamespace, namespaceOptions);
            for (var _i = 0, namespaceNodes_1 = namespaceNodes; _i < namespaceNodes_1.length; _i++) {
                var namespaceNode = namespaceNodes_1[_i];
                nodes.push(namespaceNode);
            }
        }
        this.logger.log("Done emitting class", classObject);
        return nodes;
    };
    return ClassEmitter;
}());
exports.ClassEmitter = ClassEmitter;
//# sourceMappingURL=ClassEmitter.js.map