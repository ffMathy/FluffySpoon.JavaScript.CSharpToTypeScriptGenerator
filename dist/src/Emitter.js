"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeScriptEmitter_1 = require("./TypeScriptEmitter");
var FileEmitter_1 = require("./FileEmitter");
var Logger_1 = require("./Logger");
var OptionsHelper_1 = require("./OptionsHelper");
var Emitter = /** @class */ (function () {
    function Emitter(content) {
        this.logger = new Logger_1.Logger();
        this.typeScriptEmitter = new TypeScriptEmitter_1.TypeScriptEmitter(this.logger);
        this.fileEmitter = new FileEmitter_1.FileEmitter(this.logger, this.typeScriptEmitter, content);
        this.optionsHelper = new OptionsHelper_1.OptionsHelper();
    }
    Emitter.prototype.emit = function (options) {
        if (!options)
            options = {};
        this.logger.log("Emitting file.");
        options.defaults = this.prepareEmitOptionDefaults(options.defaults);
        if (!options.file)
            options.file = {};
        this.mergeFileEmitOptions(options.file, options.defaults);
        return this.fileEmitter.emitFile(options.file);
    };
    Emitter.prototype.mergeFileEmitOptions = function (explicitSettings, defaultSettings) {
        if (!explicitSettings.classEmitOptions)
            explicitSettings.classEmitOptions = {};
        if (!explicitSettings.enumEmitOptions)
            explicitSettings.enumEmitOptions = {};
        if (!explicitSettings.interfaceEmitOptions)
            explicitSettings.interfaceEmitOptions = {};
        if (!explicitSettings.namespaceEmitOptions)
            explicitSettings.namespaceEmitOptions = {};
        if (!explicitSettings.structEmitOptions)
            explicitSettings.structEmitOptions = {};
        this.mergeClassEmitOptions(explicitSettings.classEmitOptions, defaultSettings);
        this.mergeEnumEmitOptions(explicitSettings.enumEmitOptions, defaultSettings);
        this.mergeInterfaceEmitOptions(explicitSettings.interfaceEmitOptions, defaultSettings);
        this.mergeNamespaceEmitOptions(explicitSettings.namespaceEmitOptions, defaultSettings);
        this.mergeStructEmitOptions(explicitSettings.structEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergeNamespaceEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.namespaceEmitOptions);
        if (!explicitSettings.classEmitOptions)
            explicitSettings.classEmitOptions = {};
        if (!explicitSettings.enumEmitOptions)
            explicitSettings.enumEmitOptions = {};
        if (!explicitSettings.interfaceEmitOptions)
            explicitSettings.interfaceEmitOptions = {};
        if (!explicitSettings.structEmitOptions)
            explicitSettings.structEmitOptions = {};
        this.mergeClassEmitOptions(explicitSettings.classEmitOptions, defaultSettings);
        this.mergeEnumEmitOptions(explicitSettings.enumEmitOptions, defaultSettings);
        this.mergeInterfaceEmitOptions(explicitSettings.interfaceEmitOptions, defaultSettings);
        this.mergeStructEmitOptions(explicitSettings.structEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergeClassEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.classEmitOptions);
        if (!explicitSettings.enumEmitOptions)
            explicitSettings.enumEmitOptions = {};
        if (!explicitSettings.fieldEmitOptions)
            explicitSettings.fieldEmitOptions = {};
        if (!explicitSettings.genericParameterTypeEmitOptions)
            explicitSettings.genericParameterTypeEmitOptions = {};
        if (!explicitSettings.inheritedTypeEmitOptions)
            explicitSettings.inheritedTypeEmitOptions = {};
        if (!explicitSettings.interfaceEmitOptions)
            explicitSettings.interfaceEmitOptions = {};
        if (!explicitSettings.methodEmitOptions)
            explicitSettings.methodEmitOptions = {};
        if (!explicitSettings.propertyEmitOptions)
            explicitSettings.propertyEmitOptions = {};
        if (!explicitSettings.structEmitOptions)
            explicitSettings.structEmitOptions = {};
        this.mergeEnumEmitOptions(explicitSettings.enumEmitOptions, defaultSettings);
        this.mergeFieldEmitOptions(explicitSettings.fieldEmitOptions, defaultSettings);
        this.mergeTypeEmitOptions(explicitSettings.genericParameterTypeEmitOptions, defaultSettings);
        this.mergeTypeEmitOptions(explicitSettings.inheritedTypeEmitOptions, defaultSettings);
        this.mergeInterfaceEmitOptions(explicitSettings.interfaceEmitOptions, defaultSettings);
        this.mergeMethodEmitOptions(explicitSettings.methodEmitOptions, defaultSettings);
        this.mergePropertyEmitOptions(explicitSettings.propertyEmitOptions, defaultSettings);
        this.mergeStructEmitOptions(explicitSettings.structEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergeEnumEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.enumEmitOptions);
    };
    Emitter.prototype.mergeFieldEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.fieldEmitOptions);
        if (!explicitSettings.typeEmitOptions)
            explicitSettings.typeEmitOptions = {};
        this.mergeTypeEmitOptions(explicitSettings.typeEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergeTypeEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.typeEmitOptions);
    };
    Emitter.prototype.mergeInterfaceEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.interfaceEmitOptions);
        if (!explicitSettings.genericParameterTypeEmitOptions)
            explicitSettings.genericParameterTypeEmitOptions = {};
        if (!explicitSettings.inheritedTypeEmitOptions)
            explicitSettings.inheritedTypeEmitOptions = {};
        if (!explicitSettings.methodEmitOptions)
            explicitSettings.methodEmitOptions = {};
        if (!explicitSettings.propertyEmitOptions)
            explicitSettings.propertyEmitOptions = {};
        this.mergeTypeEmitOptions(explicitSettings.genericParameterTypeEmitOptions, defaultSettings);
        this.mergeTypeEmitOptions(explicitSettings.inheritedTypeEmitOptions, defaultSettings);
        this.mergeMethodEmitOptions(explicitSettings.methodEmitOptions, defaultSettings);
        this.mergePropertyEmitOptions(explicitSettings.propertyEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergeMethodEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.methodEmitOptions);
        if (!explicitSettings.argumentTypeEmitOptions)
            explicitSettings.argumentTypeEmitOptions = {};
        if (!explicitSettings.returnTypeEmitOptions)
            explicitSettings.returnTypeEmitOptions = {};
        this.mergeTypeEmitOptions(explicitSettings.argumentTypeEmitOptions, defaultSettings);
        this.mergeTypeEmitOptions(explicitSettings.returnTypeEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergePropertyEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.propertyEmitOptions);
        if (!explicitSettings.typeEmitOptions)
            explicitSettings.typeEmitOptions = {};
        this.mergeTypeEmitOptions(explicitSettings.typeEmitOptions, defaultSettings);
    };
    Emitter.prototype.mergeStructEmitOptions = function (explicitSettings, defaultSettings) {
        this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.structEmitOptions);
        if (!explicitSettings.fieldEmitOptions)
            explicitSettings.fieldEmitOptions = {};
        if (!explicitSettings.methodEmitOptions)
            explicitSettings.methodEmitOptions = {};
        if (!explicitSettings.propertyEmitOptions)
            explicitSettings.propertyEmitOptions = {};
        this.mergeFieldEmitOptions(explicitSettings.fieldEmitOptions, defaultSettings);
        this.mergeMethodEmitOptions(explicitSettings.methodEmitOptions, defaultSettings);
        this.mergePropertyEmitOptions(explicitSettings.propertyEmitOptions, defaultSettings);
    };
    Emitter.prototype.prepareEnumEmitOptionDefaults = function (options) {
        if (!options.filter)
            options.filter = function (enumObject) { return !!enumObject.isPublic; };
        if (!options.strategy) {
            options.strategy = "default";
        }
        return options;
    };
    Emitter.prototype.prepareTypeEmitOptionDefaults = function (options) {
        if (!options.filter) {
            options.filter = function (type) { return true; };
        }
        return options;
    };
    Emitter.prototype.prepareFieldEmitOptionDefaults = function (options) {
        if (!options.typeEmitOptions)
            options.typeEmitOptions = {};
        if (!options.filter) {
            options.filter = function (field) { return !!field.isPublic; };
        }
        options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
        return options;
    };
    Emitter.prototype.preparePropertyEmitOptionDefaults = function (options) {
        if (!options.typeEmitOptions)
            options.typeEmitOptions = {};
        if (!options.filter) {
            options.filter = function (property) { return !!property.isPublic; };
        }
        if (!options.perPropertyEmitOptions) {
            options.perPropertyEmitOptions = function (property) { return ({
                name: property.name.charAt(0).toLowerCase() + property.name.substring(1)
            }); };
        }
        options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
        return options;
    };
    Emitter.prototype.prepareStructEmitOptionDefaults = function (options) {
        if (!options.methodEmitOptions)
            options.methodEmitOptions = {};
        if (!options.propertyEmitOptions)
            options.propertyEmitOptions = {};
        if (!options.fieldEmitOptions)
            options.fieldEmitOptions = {};
        if (!options.filter) {
            options.filter = function (struct) { return !!struct.isPublic; };
        }
        if (!options.perStructEmitOptions) {
            options.perStructEmitOptions = function () { return options; };
        }
        options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
        options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
        options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);
        return options;
    };
    Emitter.prototype.prepareMethodEmitOptionDefaults = function (options) {
        if (!options.argumentTypeEmitOptions)
            options.argumentTypeEmitOptions = {};
        if (!options.returnTypeEmitOptions)
            options.returnTypeEmitOptions = {};
        if (!options.filter) {
            options.filter = function (method) { return !!method.isPublic; };
        }
        options.argumentTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.argumentTypeEmitOptions);
        options.returnTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.returnTypeEmitOptions);
        return options;
    };
    Emitter.prototype.prepareInterfaceEmitOptionDefaults = function (options) {
        if (!options.genericParameterTypeEmitOptions)
            options.genericParameterTypeEmitOptions = {};
        if (!options.inheritedTypeEmitOptions)
            options.inheritedTypeEmitOptions = {};
        if (!options.methodEmitOptions)
            options.methodEmitOptions = {};
        if (!options.propertyEmitOptions)
            options.propertyEmitOptions = {};
        if (!options.filter) {
            options.filter = function (interfaceObject) { return !!interfaceObject.isPublic; };
        }
        options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
        options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
        options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
        options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
        return options;
    };
    Emitter.prototype.prepareNamespaceEmitOptionDefaults = function (options) {
        if (!options.enumEmitOptions)
            options.enumEmitOptions = {};
        if (!options.interfaceEmitOptions)
            options.interfaceEmitOptions = {};
        if (!options.structEmitOptions)
            options.structEmitOptions = {};
        if (!options.classEmitOptions)
            options.classEmitOptions = {};
        if (!options.filter) {
            options.filter = function (namespace) { return true; };
        }
        options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
        options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
        options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
        options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);
        return options;
    };
    Emitter.prototype.prepareClassEmitOptionDefaults = function (options) {
        if (!options.enumEmitOptions)
            options.enumEmitOptions = {};
        if (!options.fieldEmitOptions)
            options.fieldEmitOptions = {};
        if (!options.genericParameterTypeEmitOptions)
            options.genericParameterTypeEmitOptions = {};
        if (!options.inheritedTypeEmitOptions)
            options.inheritedTypeEmitOptions = {};
        if (!options.interfaceEmitOptions)
            options.interfaceEmitOptions = {};
        if (!options.methodEmitOptions)
            options.methodEmitOptions = {};
        if (!options.propertyEmitOptions)
            options.propertyEmitOptions = {};
        if (!options.structEmitOptions)
            options.structEmitOptions = {};
        if (!options.filter)
            options.filter = function (classObject) { return !!classObject.isPublic; };
        options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
        options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);
        options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
        options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
        options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
        options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
        options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
        options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);
        return options;
    };
    Emitter.prototype.prepareEmitOptionDefaults = function (options) {
        if (!options)
            options = {};
        if (!options.classEmitOptions)
            options.classEmitOptions = {};
        if (!options.enumEmitOptions)
            options.enumEmitOptions = {};
        if (!options.interfaceEmitOptions)
            options.interfaceEmitOptions = {};
        if (!options.namespaceEmitOptions)
            options.namespaceEmitOptions = {};
        if (!options.structEmitOptions)
            options.structEmitOptions = {};
        if (!options.typeEmitOptions)
            options.typeEmitOptions = {};
        if (!options.methodEmitOptions)
            options.methodEmitOptions = {};
        if (!options.propertyEmitOptions)
            options.propertyEmitOptions = {};
        if (!options.fieldEmitOptions)
            options.fieldEmitOptions = {};
        options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
        options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
        options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
        options.namespaceEmitOptions = this.prepareNamespaceEmitOptionDefaults(options.namespaceEmitOptions);
        options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);
        options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
        options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
        options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
        options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);
        return options;
    };
    return Emitter;
}());
exports.Emitter = Emitter;
//# sourceMappingURL=Emitter.js.map