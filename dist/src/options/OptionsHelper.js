"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileEmitOptionsInheritanceTree_1 = require("./FileEmitOptionsInheritanceTree");
var OptionsHelper = /** @class */ (function () {
    function OptionsHelper() {
    }
    OptionsHelper.mergeOptions = function (defaultOptions, initialOptions, newOptions) {
        var me = this;
        if (typeof initialOptions === "function" && initialOptions["isDefault"] !== true)
            return initialOptions;
        if (typeof newOptions === "function" && newOptions["isDefault"] !== true)
            return newOptions;
        if (typeof initialOptions === "undefined")
            return newOptions;
        if (typeof newOptions === "undefined")
            return initialOptions;
        if (!Array.isArray(initialOptions) && !Array.isArray(newOptions) &&
            typeof initialOptions === "object" && typeof newOptions === "object") {
            var defaultOptionsCopy = Object.assign({}, defaultOptions);
            var initialOptionsCopy = Object.assign({}, initialOptions);
            var newOptionsCopy = Object.assign({}, newOptions);
            var usedKeys = new Array();
            for (var parentKey in initialOptionsCopy)
                for (var childKey in newOptionsCopy) {
                    if (!initialOptionsCopy.hasOwnProperty(parentKey))
                        continue;
                    if (!newOptionsCopy.hasOwnProperty(childKey))
                        continue;
                    if (parentKey.toString() !== childKey.toString())
                        continue;
                    if (usedKeys.indexOf(parentKey) > -1)
                        continue;
                    usedKeys.push(parentKey);
                    var initialValue = initialOptionsCopy[parentKey];
                    if (typeof initialValue !== "undefined" && typeof initialValue !== "object" && typeof initialValue !== "function")
                        continue;
                    var newValue = newOptionsCopy[childKey];
                    if (typeof initialValue !== typeof newValue)
                        throw new Error("Could not merge options [" + (typeof initialValue) + "] " + parentKey + " and [" + (typeof newValue) + "] " + childKey + ".");
                    newValue = this.mergeOptions(defaultOptionsCopy[parentKey], initialValue, newValue);
                    if (typeof newValue === "undefined")
                        continue;
                    initialOptionsCopy[parentKey] = initialValue;
                    newOptionsCopy[childKey] = newValue;
                }
            var result = Object.assign(initialOptionsCopy, newOptionsCopy);
            return result;
        }
        if (typeof initialOptions !== "undefined" && typeof initialOptions !== "object" && typeof initialOptions !== "function")
            return initialOptions;
        return newOptions;
    };
    OptionsHelper.markFunctionsAsDefault = function (target) {
        for (var key in target) {
            if (!target.hasOwnProperty(key))
                continue;
            if (typeof target[key] === "function")
                target[key]["isDefault"] = true;
        }
    };
    OptionsHelper.applyInheritanceTree = function (parent, tree) {
        if (!tree)
            return parent;
        var inheritancesToRun = [];
        for (var _i = 0, tree_1 = tree; _i < tree_1.length; _i++) {
            var inheritance = tree_1[_i];
            if (inheritance.propertyName && !parent[inheritance.propertyName])
                continue;
            var property = inheritance.propertyName ?
                parent[inheritance.propertyName] :
                parent;
            var defaultValue = Object.assign({}, property);
            var returnValue = inheritance.applyInheritance(property, defaultValue);
            if (inheritance.propertyName) {
                parent[inheritance.propertyName] = returnValue.result;
            }
            else {
                parent = returnValue.result;
            }
            inheritancesToRun.push({
                parent: returnValue.result,
                tree: returnValue.tree
            });
        }
        for (var _a = 0, inheritancesToRun_1 = inheritancesToRun; _a < inheritancesToRun_1.length; _a++) {
            var inheritance = inheritancesToRun_1[_a];
            this.applyInheritanceTree(inheritance.parent, inheritance.tree);
        }
        return parent;
    };
    OptionsHelper.prepareFileEmitOptionInheritance = function (options) {
        var inheritancesToRun = [FileEmitOptionsInheritanceTree_1.fileEmitOptionsInheritanceTree];
        options = this.applyInheritanceTree(options, inheritancesToRun);
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareEnumEmitOptionDefaults = function (options) {
        if (!options.filter)
            options.filter = function (enumObject) { return !!enumObject.isPublic; };
        if (!options.strategy) {
            options.strategy = "default";
        }
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareTypeEmitOptionDefaults = function (options) {
        if (!options.filter) {
            options.filter = function (type) { return true; };
        }
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareFieldEmitOptionDefaults = function (options) {
        if (!options.typeEmitOptions)
            options.typeEmitOptions = {};
        if (!options.filter) {
            options.filter = function (field) { return !!field.isPublic; };
        }
        if (!options.perFieldEmitOptions) {
            options.perFieldEmitOptions = function () { return options; };
        }
        options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.preparePropertyEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareStructEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareMethodEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareInterfaceEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareNamespaceEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareClassEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    OptionsHelper.prepareFileEmitOptionDefaults = function (options) {
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
        this.markFunctionsAsDefault(options);
        return options;
    };
    return OptionsHelper;
}());
exports.OptionsHelper = OptionsHelper;
//# sourceMappingURL=OptionsHelper.js.map