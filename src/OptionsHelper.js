"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsHelper = (function () {
    function OptionsHelper() {
    }
    OptionsHelper.prototype.prepareFileEmitOptionInheritance = function (options) {
        var tree = {
            typeName: options.constructor.name,
            applyInheritance: function (fileEmitOptions) {
            },
            inheritanceTree: [
                {
                    typeName: options.classEmitOptions.constructor.name,
                    applyInheritance: function (classEmitOptions) {
                    },
                    inheritanceTree: []
                }
            ]
        };
    };
    /*
    fileEmitOptions => {
        "classEmitOptions": classEmitOptions => {
          apply: () => {
            class.propertyEmitOptions = merge(fileEmitOptions.propertyEmitOptions, classEmitOptions.propertyEmitOptions)
          },
          "propertyEmitOptions": propertyEmitOptions => {
            apply: () => {
              return merge(classEmitOptions.propertyEmitOptions, propertyEmitOptions)
            }
          }
        }
      }
      */
    OptionsHelper.prototype.prepareEnumEmitOptionDefaults = function (options) {
        return options;
    };
    OptionsHelper.prototype.prepareTypeEmitOptionDefaults = function (options) {
        return options;
    };
    OptionsHelper.prototype.prepareFieldEmitOptionDefaults = function (options) {
        if (!options.typeEmitOptions)
            options.typeEmitOptions = {};
        options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
        return options;
    };
    OptionsHelper.prototype.preparePropertyEmitOptionDefaults = function (options) {
        if (!options.typeEmitOptions)
            options.typeEmitOptions = {};
        options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
        return options;
    };
    OptionsHelper.prototype.prepareStructEmitOptionDefaults = function (options) {
        if (!options.methodEmitOptions)
            options.methodEmitOptions = {};
        if (!options.propertyEmitOptions)
            options.propertyEmitOptions = {};
        if (!options.fieldEmitOptions)
            options.fieldEmitOptions = {};
        options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
        options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
        options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);
        return options;
    };
    OptionsHelper.prototype.prepareMethodEmitOptionDefaults = function (options) {
        if (!options.argumentTypeEmitOptions)
            options.argumentTypeEmitOptions = {};
        if (!options.returnTypeEmitOptions)
            options.returnTypeEmitOptions = {};
        options.argumentTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.argumentTypeEmitOptions);
        options.returnTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.returnTypeEmitOptions);
        return options;
    };
    OptionsHelper.prototype.prepareInterfaceEmitOptionDefaults = function (options) {
        if (!options.genericParameterTypeEmitOptions)
            options.genericParameterTypeEmitOptions = {};
        if (!options.inheritedTypeEmitOptions)
            options.inheritedTypeEmitOptions = {};
        if (!options.methodEmitOptions)
            options.methodEmitOptions = {};
        if (!options.propertyEmitOptions)
            options.propertyEmitOptions = {};
        options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
        options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
        options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
        options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
        return options;
    };
    OptionsHelper.prototype.prepareNamespaceEmitOptionDefaults = function (options) {
        if (!options.enumEmitOptions)
            options.enumEmitOptions = {};
        if (!options.interfaceEmitOptions)
            options.interfaceEmitOptions = {};
        if (!options.structEmitOptions)
            options.structEmitOptions = {};
        if (!options.classEmitOptions)
            options.classEmitOptions = {};
        options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
        options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
        options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
        options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);
        return options;
    };
    OptionsHelper.prototype.prepareClassEmitOptionDefaults = function (options) {
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
    OptionsHelper.prototype.prepareFileEmitOptionDefaults = function (options) {
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
    return OptionsHelper;
}());
exports.OptionsHelper = OptionsHelper;
//# sourceMappingURL=OptionsHelper.js.map