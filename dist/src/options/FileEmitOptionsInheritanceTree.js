"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsHelper_1 = require("./OptionsHelper");
var tree = {
    applyInheritance: function (fileEmitOptions) {
        return {
            result: fileEmitOptions, tree: [
                {
                    propertyName: "methodEmitOptions",
                    applyInheritance: function (methodEmitOptions) {
                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                        return { result: methodEmitOptions };
                    }
                },
                {
                    propertyName: "fieldEmitOptions",
                    applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                        return {
                            result: fieldEmitOptions, tree: [
                                {
                                    propertyName: "typeEmitOptions",
                                    applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                        typeEmitOptions.filter = function (type) {
                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                defaultTypeEmitOptions.filter(type);
                                        };
                                        return { result: typeEmitOptions };
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    propertyName: "propertyEmitOptions",
                    applyInheritance: function (propertyEmitOptions, defaultPropertyEmitOptions) {
                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                        return { result: propertyEmitOptions };
                    }
                },
                {
                    propertyName: "namespaceEmitOptions",
                    applyInheritance: function (namespaceEmitOptions) {
                        namespaceEmitOptions.classEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareClassEmitOptionDefaults({}), fileEmitOptions.classEmitOptions, namespaceEmitOptions.classEmitOptions);
                        namespaceEmitOptions.enumEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareEnumEmitOptionDefaults({}), fileEmitOptions.enumEmitOptions, namespaceEmitOptions.enumEmitOptions);
                        namespaceEmitOptions.interfaceEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareInterfaceEmitOptionDefaults({}), fileEmitOptions.interfaceEmitOptions, namespaceEmitOptions.interfaceEmitOptions);
                        namespaceEmitOptions.structEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareStructEmitOptionDefaults({}), fileEmitOptions.structEmitOptions, namespaceEmitOptions.structEmitOptions);
                        return {
                            result: namespaceEmitOptions, tree: [
                                {
                                    propertyName: "structEmitOptions",
                                    applyInheritance: function (structEmitOptions) {
                                        structEmitOptions.fieldEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), fileEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                        structEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), fileEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                        structEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                        return {
                                            result: structEmitOptions, tree: [
                                                {
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: function (methodEmitOptions) {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: function (propertyEmitOptions) {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                        return { result: propertyEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "fieldEmitOptions",
                                                    applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                        return {
                                                            result: fieldEmitOptions, tree: [
                                                                {
                                                                    propertyName: "typeEmitOptions",
                                                                    applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                        typeEmitOptions.filter = function (type) {
                                                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                                defaultTypeEmitOptions.filter(type);
                                                                        };
                                                                        return { result: typeEmitOptions };
                                                                    }
                                                                }
                                                            ]
                                                        };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                {
                                    propertyName: "interfaceEmitOptions",
                                    applyInheritance: function (interfaceEmitOptions) {
                                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                        interfaceEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), fileEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                        return {
                                            result: interfaceEmitOptions, tree: [
                                                {
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: function (methodEmitOptions) {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: function (propertyEmitOptions) {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                        return { result: propertyEmitOptions };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                {
                                    propertyName: "classEmitOptions",
                                    applyInheritance: function (classEmitOptions) {
                                        classEmitOptions.enumEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareEnumEmitOptionDefaults({}), namespaceEmitOptions.enumEmitOptions, classEmitOptions.enumEmitOptions);
                                        classEmitOptions.fieldEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), fileEmitOptions.fieldEmitOptions, classEmitOptions.fieldEmitOptions);
                                        classEmitOptions.genericParameterTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, classEmitOptions.genericParameterTypeEmitOptions);
                                        classEmitOptions.inheritedTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, classEmitOptions.inheritedTypeEmitOptions);
                                        classEmitOptions.interfaceEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareInterfaceEmitOptionDefaults({}), namespaceEmitOptions.interfaceEmitOptions, classEmitOptions.interfaceEmitOptions);
                                        classEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), fileEmitOptions.methodEmitOptions, classEmitOptions.methodEmitOptions);
                                        classEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions, classEmitOptions.propertyEmitOptions);
                                        classEmitOptions.structEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareStructEmitOptionDefaults({}), namespaceEmitOptions.structEmitOptions, classEmitOptions.structEmitOptions);
                                        return {
                                            result: classEmitOptions, tree: [
                                                {
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: function (methodEmitOptions) {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: function (propertyEmitOptions) {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                        return { result: propertyEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "fieldEmitOptions",
                                                    applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                        return {
                                                            result: fieldEmitOptions, tree: [
                                                                {
                                                                    propertyName: "typeEmitOptions",
                                                                    applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                        typeEmitOptions.filter = function (type) {
                                                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                                defaultTypeEmitOptions.filter(type);
                                                                        };
                                                                        return { result: typeEmitOptions };
                                                                    }
                                                                }
                                                            ]
                                                        };
                                                    }
                                                },
                                                {
                                                    propertyName: "structEmitOptions",
                                                    applyInheritance: function (structEmitOptions) {
                                                        structEmitOptions.fieldEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), classEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                                        structEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), classEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                                        structEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), classEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                                        return {
                                                            result: structEmitOptions, tree: [
                                                                {
                                                                    propertyName: "methodEmitOptions",
                                                                    applyInheritance: function (methodEmitOptions) {
                                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                        return { result: methodEmitOptions };
                                                                    }
                                                                },
                                                                {
                                                                    propertyName: "propertyEmitOptions",
                                                                    applyInheritance: function (propertyEmitOptions) {
                                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                                        return { result: propertyEmitOptions };
                                                                    }
                                                                },
                                                                {
                                                                    propertyName: "fieldEmitOptions",
                                                                    applyInheritance: function (fieldEmitOptions) {
                                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                                        return {
                                                                            result: fieldEmitOptions, tree: [
                                                                                {
                                                                                    propertyName: "typeEmitOptions",
                                                                                    applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                                        typeEmitOptions.filter = function (type) {
                                                                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                                                defaultTypeEmitOptions.filter(type);
                                                                                        };
                                                                                        return { result: typeEmitOptions };
                                                                                    }
                                                                                }
                                                                            ]
                                                                        };
                                                                    }
                                                                }
                                                            ]
                                                        };
                                                    }
                                                },
                                                {
                                                    propertyName: "interfaceEmitOptions",
                                                    applyInheritance: function (interfaceEmitOptions) {
                                                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), classEmitOptions.genericParameterTypeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), classEmitOptions.inheritedTypeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                                        interfaceEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), classEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), classEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                                        return {
                                                            result: interfaceEmitOptions, tree: [
                                                                {
                                                                    propertyName: "methodEmitOptions",
                                                                    applyInheritance: function (methodEmitOptions) {
                                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                        return { result: methodEmitOptions };
                                                                    }
                                                                },
                                                                {
                                                                    propertyName: "propertyEmitOptions",
                                                                    applyInheritance: function (propertyEmitOptions) {
                                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                                        return { result: propertyEmitOptions };
                                                                    }
                                                                }
                                                            ]
                                                        };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    propertyName: "structEmitOptions",
                    applyInheritance: function (structEmitOptions) {
                        structEmitOptions.fieldEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), fileEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                        structEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), fileEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                        structEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                        return {
                            result: structEmitOptions, tree: [
                                {
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: function (methodEmitOptions) {
                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                        return { result: methodEmitOptions };
                                    }
                                },
                                {
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: function (propertyEmitOptions) {
                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                        return { result: propertyEmitOptions };
                                    }
                                },
                                {
                                    propertyName: "fieldEmitOptions",
                                    applyInheritance: function (fieldEmitOptions) {
                                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                        return { result: fieldEmitOptions };
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    propertyName: "interfaceEmitOptions",
                    applyInheritance: function (interfaceEmitOptions) {
                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                        interfaceEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), fileEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                        return {
                            result: interfaceEmitOptions, tree: [
                                {
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: function (methodEmitOptions) {
                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                        return { result: methodEmitOptions };
                                    }
                                },
                                {
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: function (propertyEmitOptions) {
                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                        return { result: propertyEmitOptions };
                                    }
                                }
                            ]
                        };
                    }
                },
                {
                    propertyName: "classEmitOptions",
                    applyInheritance: function (classEmitOptions) {
                        classEmitOptions.enumEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareEnumEmitOptionDefaults({}), fileEmitOptions.enumEmitOptions, classEmitOptions.enumEmitOptions);
                        classEmitOptions.fieldEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), fileEmitOptions.fieldEmitOptions, classEmitOptions.fieldEmitOptions);
                        classEmitOptions.genericParameterTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, classEmitOptions.genericParameterTypeEmitOptions);
                        classEmitOptions.inheritedTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, classEmitOptions.inheritedTypeEmitOptions);
                        classEmitOptions.interfaceEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareInterfaceEmitOptionDefaults({}), fileEmitOptions.interfaceEmitOptions, classEmitOptions.interfaceEmitOptions);
                        classEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), fileEmitOptions.methodEmitOptions, classEmitOptions.methodEmitOptions);
                        classEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions, classEmitOptions.propertyEmitOptions);
                        classEmitOptions.structEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareStructEmitOptionDefaults({}), fileEmitOptions.structEmitOptions, classEmitOptions.structEmitOptions);
                        return {
                            result: classEmitOptions, tree: [
                                {
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: function (methodEmitOptions) {
                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                        return { result: methodEmitOptions };
                                    }
                                },
                                {
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: function (propertyEmitOptions, defaultPropertyEmitOptions) {
                                        propertyEmitOptions.perPropertyEmitOptions = function (property) {
                                            return OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property), defaultPropertyEmitOptions.perPropertyEmitOptions(property));
                                        };
                                        propertyEmitOptions.perPropertyEmitOptions = function (property) {
                                            return OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property), defaultPropertyEmitOptions.perPropertyEmitOptions(property));
                                        };
                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                        return { result: propertyEmitOptions };
                                    }
                                },
                                {
                                    propertyName: "fieldEmitOptions",
                                    applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                        fieldEmitOptions.perFieldEmitOptions = function (field) {
                                            return OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), fileEmitOptions.fieldEmitOptions.perFieldEmitOptions(field), defaultFieldEmitOptions.perFieldEmitOptions(field));
                                        };
                                        return {
                                            result: fieldEmitOptions, tree: [
                                                {
                                                    propertyName: "typeEmitOptions",
                                                    applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                        typeEmitOptions.filter = function (type) {
                                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                defaultTypeEmitOptions.filter(type);
                                                        };
                                                        return { result: typeEmitOptions };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                {
                                    propertyName: "structEmitOptions",
                                    applyInheritance: function (structEmitOptions) {
                                        structEmitOptions.fieldEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareFieldEmitOptionDefaults({}), classEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                        structEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), classEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                        structEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), classEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                        return {
                                            result: structEmitOptions, tree: [
                                                {
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: function (methodEmitOptions) {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: function (propertyEmitOptions) {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                        return { result: propertyEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "fieldEmitOptions",
                                                    applyInheritance: function (fieldEmitOptions) {
                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                        return {
                                                            result: fieldEmitOptions, tree: [
                                                                {
                                                                    propertyName: "typeEmitOptions",
                                                                    applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                        typeEmitOptions.filter = function (type) {
                                                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                                defaultTypeEmitOptions.filter(type);
                                                                        };
                                                                        return { result: typeEmitOptions };
                                                                    }
                                                                }
                                                            ]
                                                        };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                {
                                    propertyName: "interfaceEmitOptions",
                                    applyInheritance: function (interfaceEmitOptions) {
                                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), classEmitOptions.genericParameterTypeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), classEmitOptions.inheritedTypeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                        interfaceEmitOptions.methodEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareMethodEmitOptionDefaults({}), classEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.preparePropertyEmitOptionDefaults({}), classEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                        return {
                                            result: interfaceEmitOptions, tree: [
                                                {
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: function (methodEmitOptions) {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                {
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: function (propertyEmitOptions) {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper_1.OptionsHelper.mergeOptions(OptionsHelper_1.OptionsHelper.prepareTypeEmitOptionDefaults({}), fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                        return { result: propertyEmitOptions };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                }
                            ]
                        };
                    }
                }
            ]
        };
    }
};
exports.fileEmitOptionsInheritanceTree = tree;
//# sourceMappingURL=FileEmitOptionsInheritanceTree.js.map