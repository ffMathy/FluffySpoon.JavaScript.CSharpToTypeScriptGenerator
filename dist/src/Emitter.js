"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringEmitter_1 = require("./StringEmitter");
var FileEmitter_1 = require("./FileEmitter");
var Logger_1 = require("./Logger");
var Emitter = /** @class */ (function () {
    function Emitter(content) {
        this.logger = new Logger_1.Logger();
        this.stringEmitter = new StringEmitter_1.StringEmitter(this.logger);
        this.fileEmitter = new FileEmitter_1.FileEmitter(this.logger, this.stringEmitter, content);
    }
    Emitter.prototype.emit = function (options) {
        if (!options)
            options = {};
        this.logger.log("Emitting file.");
        options.defaults = this.prepareEmitOptionDefaults(options.defaults);
        if (!options.file)
            options.file = {};
        this.mergeOptions({}, options.file.enumEmitOptions, options.defaults.enumEmitOptions);
        this.mergeOptions({}, options.file.classEmitOptions, options.defaults.classEmitOptions);
        this.mergeOptions({}, options.file.interfaceEmitOptions, options.defaults.interfaceEmitOptions);
        this.mergeOptions({}, options.file.namespaceEmitOptions, options.defaults.namespaceEmitOptions);
        this.mergeOptions({}, options.file.structEmitOptions, options.defaults.structEmitOptions);
        return this.fileEmitter.emitFile(options.file);
    };
    Emitter.prototype.mergeFileEmitOptions = function (fromSettings, toSettings, defaultSettings) {
        this.mergeOptions(fromSettings.enumEmitOptions, toSettings.enumEmitOptions, defaultSettings.enumEmitOptions);
        this.mergeClassEmitOptions(fromSettings.classEmitOptions, toSettings.classEmitOptions, defaultSettings.classEmitOptions);
        this.mergeInterfaceEmitOptions(fromSettings.interfaceEmitOptions, toSettings.interfaceEmitOptions, defaultSettings.interfaceEmitOptions);
        this.mergeNamespaceEmitOptions(fromSettings.namespaceEmitOptions, toSettings.namespaceEmitOptions, defaultSettings.namespaceEmitOptions);
        this.mergeStructEmitOptions(fromSettings.structEmitOptions, toSettings.structEmitOptions, defaultSettings.structEmitOptions);
    };
    Emitter.prototype.mergeClassEmitOptions = function (fromSettings, toSettings, defaultSettings) {
        this.mergeOptions(fromSettings, toSettings, defaultSettings.classEmitOptions);
        this.mergeOptions(fromSettings.enumEmitOptions, toSettings.enumEmitOptions, defaultSettings.enumEmitOptions);
        this.mergeOptions(fromSettings.fieldEmitOptions, toSettings.fieldEmitOptions, defaultSettings.fieldEmitOptions);
        this.mergeOptions(fromSettings.fieldEmitOptions, toSettings.fieldEmitOptions, defaultSettings.fieldEmitOptions);
    };
    Emitter.prototype.mergeMethodEmitOptions = function (fromSettings, toSettings, defaultSettings) {
        this.mergeOptions(fromSettings, toSettings, defaultSettings.methodEmitOptions);
        this.mergeOptions(fromSettings.returnTypeEmitOptions, toSettings.returnTypeEmitOptions, defaultSettings.typeEmitOptions);
    };
    Emitter.prototype.mergeOptions = function (fromSettings, toSettings, defaultSettings) {
        if (!toSettings)
            toSettings = {};
        var properties = Object.getOwnPropertyNames(defaultSettings);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var propertyName = properties_1[_i];
            var typeName = typeof defaultSettings[propertyName];
            if (typeName === "function" || typeName === "object")
                continue;
            if (!(propertyName in toSettings))
                toSettings[propertyName] = fromSettings[propertyName] || defaultSettings[propertyName];
        }
        return toSettings;
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
        if (!options.perFieldEmitOptions) {
            options.perFieldEmitOptions = function () { return options; };
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
        if (!options.perMethodEmitOptions) {
            options.perMethodEmitOptions = function () { return options; };
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
        if (!options.perInterfaceEmitOptions) {
            options.perInterfaceEmitOptions = function () { return options; };
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
        if (!options.perClassEmitOptions)
            options.perClassEmitOptions = function () { return ({}); };
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