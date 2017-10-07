"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumEmitter_1 = require("./EnumEmitter");
var TypeEmitter_1 = require("./TypeEmitter");
var PropertyEmitter_1 = require("./PropertyEmitter");
var InterfaceEmitter_1 = require("./InterfaceEmitter");
var FieldEmitter_1 = require("./FieldEmitter");
var MethodEmitter_1 = require("./MethodEmitter");
var ts = require("typescript");
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
    }
    ClassEmitter.prototype.emitClasses = function (classes, options) {
        this.logger.log("Emitting classes", classes);
        for (var _i = 0, classes_1 = classes; _i < classes_1.length; _i++) {
            var classObject = classes_1[_i];
            this.emitClass(classObject, options);
        }
        this.stringEmitter.removeLastNewLines();
        this.logger.log("Done emitting classes", classes);
    };
    ClassEmitter.prototype.emitClass = function (classObject, options) {
        var node = this.createTypeScriptClassNode(classObject, options);
        if (!node)
            return;
        this.stringEmitter.emitTypeScriptNode(node);
    };
    ClassEmitter.prototype.createTypeScriptClassNode = function (classObject, options) {
        var _this = this;
        options = this.prepareOptions(options);
        options = Object.assign(options, options.perClassEmitOptions(classObject));
        if (!options.filter(classObject))
            return null;
        if (classObject.properties.length === 0 && classObject.methods.length === 0 && classObject.fields.length === 0) {
            this.logger.log("Skipping emitting body of class " + classObject.name + " because it contains no properties, fields or methods");
            return null;
        }
        this.logger.log("Emitting class", classObject);
        this.emitClassInterface(classObject, options);
        this.stringEmitter.ensureNewParagraph();
        this.emitSubElementsInClass(classObject, options);
        this.stringEmitter.ensureNewParagraph();
        var modifiers = new Array();
        if (options.declare)
            modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));
        var heritageClause;
        if (classObject.inheritsFrom && this.typeEmitter.canEmitType(classObject.inheritsFrom))
            heritageClause = ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [this.typeEmitter.createTypeScriptExpressionWithTypeArguments(classObject.inheritsFrom, options.inheritedTypeEmitOptions)]);
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
        var genericParameters = classObject
            .genericParameters
            .map(function (x) { return _this
            .typeEmitter
            .createTypeScriptTypeParameterDeclaration(x, options.genericParameterTypeEmitOptions); });
        var fields = classObject
            .fields
            .map(function (x) { return _this
            .fieldEmitter
            .createTypeScriptFieldNode(x, options.fieldEmitOptions); });
        var classMembers = methods.concat(properties, fields);
        if (classObject.classes.length > 0 ||
            classObject.interfaces.length > 0 ||
            classObject.enums.length > 0) {
            if (classObject.enums.length > 0) {
                var classEnumOptions = Object.assign(options.enumEmitOptions, {
                    declare: false
                });
                this.enumEmitter.emitEnums(classObject.enums, classEnumOptions);
                this.stringEmitter.ensureNewParagraph();
            }
            if (classObject.classes.length > 0) {
                var optionsClone = Object.assign({}, options);
                var subClassOptions = Object.assign(optionsClone, {
                    declare: false
                });
                this.emitClasses(classObject.classes, subClassOptions);
                this.stringEmitter.ensureNewParagraph();
            }
            if (classObject.interfaces.length > 0) {
                var classInterfaceOptions = Object.assign(options, {
                    declare: false
                });
                this.interfaceEmitter.emitInterfaces(classObject.interfaces, classInterfaceOptions);
                this.stringEmitter.ensureNewParagraph();
            }
        }
        var node = ts.createInterfaceDeclaration([], modifiers, options.name || classObject.name, genericParameters, [heritageClause], classMembers);
        this.logger.log("Done emitting class", classObject);
        return node;
    };
    ClassEmitter.prototype.prepareOptions = function (options) {
        if (!options) {
            options = {};
        }
        if (!options.filter) {
            options.filter = function (classObject) { return classObject.isPublic; };
        }
        if (!options.perClassEmitOptions) {
            options.perClassEmitOptions = function () { return ({}); };
        }
        return options;
    };
    ClassEmitter.prototype.emitSubElementsInClass = function (classObject, options) {
        if (classObject.enums.length === 0 && classObject.classes.length === 0 && classObject.interfaces.length === 0) {
            this.logger.log("Skipping sub elements of class " + classObject.name + " because it contains no enums, classes or interfaces");
            return;
        }
        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");
        this.stringEmitter.write("namespace " + classObject.name + " {");
        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();
        if (classObject.enums.length > 0) {
            var classEnumOptions = Object.assign(options.enumEmitOptions, {
                declare: false
            });
            this.enumEmitter.emitEnums(classObject.enums, classEnumOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        if (classObject.classes.length > 0) {
            var optionsClone = Object.assign({}, options);
            var subClassOptions = Object.assign(optionsClone, {
                declare: false
            });
            this.emitClasses(classObject.classes, subClassOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        if (classObject.interfaces.length > 0) {
            var classInterfaceOptions = Object.assign(options, {
                declare: false
            });
            this.interfaceEmitter.emitInterfaces(classObject.interfaces, classInterfaceOptions);
            this.stringEmitter.ensureNewParagraph();
        }
        this.stringEmitter.removeLastNewLines();
        this.stringEmitter.decreaseIndentation();
        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
    };
    return ClassEmitter;
}());
exports.ClassEmitter = ClassEmitter;
//# sourceMappingURL=ClassEmitter.js.map