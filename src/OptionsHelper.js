"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsHelper = /** @class */ (function () {
    function OptionsHelper() {
    }
    OptionsHelper.prototype.mergeOptions = function (defaultOptions, newOptions) {
        var me = this;
        if (typeof defaultOptions === "function")
            return null;
        if (typeof newOptions === "function")
            return null;
        if (typeof defaultOptions === "undefined")
            return newOptions;
        if (typeof newOptions === "undefined")
            return defaultOptions;
        if (!Array.isArray(defaultOptions) && !Array.isArray(newOptions) &&
            typeof defaultOptions === "object" && typeof newOptions === "object") {
            var parent = Object.assign({}, defaultOptions);
            var child = Object.assign({}, newOptions);
            for (var parentKey in parent)
                for (var childKey in child) {
                    if (!parent.hasOwnProperty(parentKey))
                        continue;
                    if (!child.hasOwnProperty(childKey))
                        continue;
                    if (parentKey.toString() !== childKey.toString())
                        continue;
                    var defaultValue = parent[parentKey];
                    if (typeof defaultValue !== "undefined" && typeof defaultValue !== "object" && typeof defaultValue !== "function")
                        continue;
                    var newValue = child[childKey];
                    if (typeof defaultValue !== typeof newValue)
                        throw new Error("Could not merge options [" + typeof defaultValue + "] " + parentKey + " and [" + typeof newValue + "] " + childKey + ".");
                    if (typeof defaultValue === "function")
                        continue;
                    newValue = this.mergeOptions(defaultValue, newValue);
                    parent[parentKey] = defaultValue;
                    child[childKey] = newValue;
                }
            return Object.assign(parent, child);
        }
        if (typeof defaultOptions !== "undefined" && typeof defaultOptions !== "object" && typeof defaultOptions !== "function")
            return defaultOptions;
        return newOptions;
    };
    OptionsHelper.prototype.applyInheritanceTree = function (parent, tree) {
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
    OptionsHelper.prototype.prepareFileEmitOptionInheritance = function (options) {
        var _this = this;
        var tree = {
            applyInheritance: function (fileEmitOptions) {
                return {
                    result: fileEmitOptions, tree: [
                        {
                            propertyName: "methodEmitOptions",
                            applyInheritance: function (methodEmitOptions) {
                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                return { result: methodEmitOptions };
                            }
                        },
                        {
                            propertyName: "fieldEmitOptions",
                            applyInheritance: function (fieldEmitOptions) {
                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                return {
                                    result: fieldEmitOptions, tree: [
                                        {
                                            propertyName: "typeEmitOptions",
                                            applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                console.log("file->field->type inherited from file->type");
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
                            applyInheritance: function (propertyEmitOptions) {
                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                return { result: propertyEmitOptions };
                            }
                        },
                        {
                            propertyName: "namespaceEmitOptions",
                            applyInheritance: function (namespaceEmitOptions) {
                                namespaceEmitOptions.classEmitOptions = _this.mergeOptions(fileEmitOptions.classEmitOptions, namespaceEmitOptions.classEmitOptions);
                                namespaceEmitOptions.enumEmitOptions = _this.mergeOptions(fileEmitOptions.enumEmitOptions, namespaceEmitOptions.enumEmitOptions);
                                namespaceEmitOptions.interfaceEmitOptions = _this.mergeOptions(fileEmitOptions.interfaceEmitOptions, namespaceEmitOptions.interfaceEmitOptions);
                                namespaceEmitOptions.structEmitOptions = _this.mergeOptions(fileEmitOptions.structEmitOptions, namespaceEmitOptions.structEmitOptions);
                                return {
                                    result: namespaceEmitOptions, tree: [
                                        {
                                            propertyName: "structEmitOptions",
                                            applyInheritance: function (structEmitOptions) {
                                                structEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                                structEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                                structEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                                return {
                                                    result: structEmitOptions, tree: [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                return { result: methodEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                                return { result: propertyEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "fieldEmitOptions",
                                                            applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                                return {
                                                                    result: fieldEmitOptions, tree: [
                                                                        {
                                                                            propertyName: "typeEmitOptions",
                                                                            applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                                console.log("file->namespace->struct->field->type inherited from file->type");
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
                                                interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                                interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                                interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                                interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                                return {
                                                    result: interfaceEmitOptions, tree: [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                return { result: methodEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
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
                                                classEmitOptions.enumEmitOptions = _this.mergeOptions(namespaceEmitOptions.enumEmitOptions, classEmitOptions.enumEmitOptions);
                                                classEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, classEmitOptions.fieldEmitOptions);
                                                classEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, classEmitOptions.genericParameterTypeEmitOptions);
                                                classEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, classEmitOptions.inheritedTypeEmitOptions);
                                                classEmitOptions.interfaceEmitOptions = _this.mergeOptions(namespaceEmitOptions.interfaceEmitOptions, classEmitOptions.interfaceEmitOptions);
                                                classEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, classEmitOptions.methodEmitOptions);
                                                classEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, classEmitOptions.propertyEmitOptions);
                                                classEmitOptions.structEmitOptions = _this.mergeOptions(namespaceEmitOptions.structEmitOptions, classEmitOptions.structEmitOptions);
                                                return {
                                                    result: classEmitOptions, tree: [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                return { result: methodEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                                return { result: propertyEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "fieldEmitOptions",
                                                            applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                                return {
                                                                    result: fieldEmitOptions, tree: [
                                                                        {
                                                                            propertyName: "typeEmitOptions",
                                                                            applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                                console.log("file->namespace->class->field->type inherited from file->type");
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
                                                                structEmitOptions.fieldEmitOptions = _this.mergeOptions(classEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                                                structEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                                                structEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                                                return {
                                                                    result: structEmitOptions, tree: [
                                                                        {
                                                                            propertyName: "methodEmitOptions",
                                                                            applyInheritance: function (methodEmitOptions) {
                                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                                return { result: methodEmitOptions };
                                                                            }
                                                                        },
                                                                        {
                                                                            propertyName: "propertyEmitOptions",
                                                                            applyInheritance: function (propertyEmitOptions) {
                                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                                                return { result: propertyEmitOptions };
                                                                            }
                                                                        },
                                                                        {
                                                                            propertyName: "fieldEmitOptions",
                                                                            applyInheritance: function (fieldEmitOptions) {
                                                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                                                return {
                                                                                    result: fieldEmitOptions, tree: [
                                                                                        {
                                                                                            propertyName: "typeEmitOptions",
                                                                                            applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                                                console.log("file->namespace->class->struct->field->type inherited from file->type");
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
                                                                interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(classEmitOptions.genericParameterTypeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                                                interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(classEmitOptions.inheritedTypeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                                                interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                                                interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                                                return {
                                                                    result: interfaceEmitOptions, tree: [
                                                                        {
                                                                            propertyName: "methodEmitOptions",
                                                                            applyInheritance: function (methodEmitOptions) {
                                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                                return { result: methodEmitOptions };
                                                                            }
                                                                        },
                                                                        {
                                                                            propertyName: "propertyEmitOptions",
                                                                            applyInheritance: function (propertyEmitOptions) {
                                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
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
                                structEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                structEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                structEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                return {
                                    result: structEmitOptions, tree: [
                                        {
                                            propertyName: "methodEmitOptions",
                                            applyInheritance: function (methodEmitOptions) {
                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                return { result: methodEmitOptions };
                                            }
                                        },
                                        {
                                            propertyName: "propertyEmitOptions",
                                            applyInheritance: function (propertyEmitOptions) {
                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                return { result: propertyEmitOptions };
                                            }
                                        },
                                        {
                                            propertyName: "fieldEmitOptions",
                                            applyInheritance: function (fieldEmitOptions) {
                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
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
                                interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                return {
                                    result: interfaceEmitOptions, tree: [
                                        {
                                            propertyName: "methodEmitOptions",
                                            applyInheritance: function (methodEmitOptions) {
                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                return { result: methodEmitOptions };
                                            }
                                        },
                                        {
                                            propertyName: "propertyEmitOptions",
                                            applyInheritance: function (propertyEmitOptions) {
                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
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
                                classEmitOptions.enumEmitOptions = _this.mergeOptions(fileEmitOptions.enumEmitOptions, classEmitOptions.enumEmitOptions);
                                classEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, classEmitOptions.fieldEmitOptions);
                                classEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, classEmitOptions.genericParameterTypeEmitOptions);
                                classEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, classEmitOptions.inheritedTypeEmitOptions);
                                classEmitOptions.interfaceEmitOptions = _this.mergeOptions(fileEmitOptions.interfaceEmitOptions, classEmitOptions.interfaceEmitOptions);
                                classEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, classEmitOptions.methodEmitOptions);
                                classEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, classEmitOptions.propertyEmitOptions);
                                classEmitOptions.structEmitOptions = _this.mergeOptions(fileEmitOptions.structEmitOptions, classEmitOptions.structEmitOptions);
                                return {
                                    result: classEmitOptions, tree: [
                                        {
                                            propertyName: "methodEmitOptions",
                                            applyInheritance: function (methodEmitOptions) {
                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                return { result: methodEmitOptions };
                                            }
                                        },
                                        {
                                            propertyName: "propertyEmitOptions",
                                            applyInheritance: function (propertyEmitOptions, defaultPropertyEmitOptions) {
                                                propertyEmitOptions.perPropertyEmitOptions = function (property) {
                                                    return _this.mergeOptions(fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property), defaultPropertyEmitOptions.perPropertyEmitOptions(property));
                                                };
                                                propertyEmitOptions.perPropertyEmitOptions = function (property) {
                                                    return _this.mergeOptions(fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property), defaultPropertyEmitOptions.perPropertyEmitOptions(property));
                                                };
                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                return { result: propertyEmitOptions };
                                            }
                                        },
                                        {
                                            propertyName: "fieldEmitOptions",
                                            applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                fieldEmitOptions.perFieldEmitOptions = function (field) {
                                                    return _this.mergeOptions(fileEmitOptions.fieldEmitOptions.perFieldEmitOptions(field), defaultFieldEmitOptions.perFieldEmitOptions(field));
                                                };
                                                return {
                                                    result: fieldEmitOptions, tree: [
                                                        {
                                                            propertyName: "typeEmitOptions",
                                                            applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                console.log("file->class->field->type inherited from file->type");
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
                                                structEmitOptions.fieldEmitOptions = _this.mergeOptions(classEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                                structEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                                structEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                                return {
                                                    result: structEmitOptions, tree: [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                return { result: methodEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                                return { result: propertyEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "fieldEmitOptions",
                                                            applyInheritance: function (fieldEmitOptions) {
                                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                                return {
                                                                    result: fieldEmitOptions, tree: [
                                                                        {
                                                                            propertyName: "typeEmitOptions",
                                                                            applyInheritance: function (typeEmitOptions, defaultTypeEmitOptions) {
                                                                                console.log("file->class->struct->field->type inherited from file->type");
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
                                                interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(classEmitOptions.genericParameterTypeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                                interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(classEmitOptions.inheritedTypeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                                interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                                interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                                return {
                                                    result: interfaceEmitOptions, tree: [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                                return { result: methodEmitOptions };
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
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
        var inheritancesToRun = [tree];
        options = this.applyInheritanceTree(options, inheritancesToRun);
        return options;
    };
    OptionsHelper.prototype.prepareEnumEmitOptionDefaults = function (options) {
        if (!options.filter)
            options.filter = function (enumObject) { return !!enumObject.isPublic; };
        if (!options.strategy) {
            options.strategy = "default";
        }
        return options;
    };
    OptionsHelper.prototype.prepareTypeEmitOptionDefaults = function (options) {
        if (!options.filter) {
            options.filter = function (type) { return true; };
        }
        return options;
    };
    OptionsHelper.prototype.prepareFieldEmitOptionDefaults = function (options) {
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
    OptionsHelper.prototype.preparePropertyEmitOptionDefaults = function (options) {
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
    OptionsHelper.prototype.prepareStructEmitOptionDefaults = function (options) {
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
    OptionsHelper.prototype.prepareMethodEmitOptionDefaults = function (options) {
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
    OptionsHelper.prototype.prepareInterfaceEmitOptionDefaults = function (options) {
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
    OptionsHelper.prototype.prepareNamespaceEmitOptionDefaults = function (options) {
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