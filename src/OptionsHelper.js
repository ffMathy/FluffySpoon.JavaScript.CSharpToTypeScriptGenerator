"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsHelper = /** @class */ (function () {
    function OptionsHelper() {
    }
    OptionsHelper.prototype.mergeOptions = function (defaultOptions, newOptions) {
        var me = this;
        if (!Array.isArray(defaultOptions) && !Array.isArray(newOptions) && typeof defaultOptions === "object" && typeof newOptions === "object") {
            var parent = Object.assign({}, defaultOptions);
            var child = Object.assign({}, newOptions);
            for (var parentKey in parent) {
                var _loop_1 = function () {
                    if (!parent.hasOwnProperty(parentKey))
                        return "continue";
                    if (!child.hasOwnProperty(childKey))
                        return "continue";
                    if (parentKey.toString() !== childKey.toString())
                        return "continue";
                    defaultValue = parent[parentKey];
                    if (typeof defaultValue !== "undefined" && typeof defaultValue !== "object" && typeof defaultValue !== "function")
                        return "continue";
                    newValue = child[childKey];
                    if (typeof defaultValue !== typeof newValue)
                        throw new Error("Could not merge options [" + typeof defaultValue + "] " + parentKey + " and [" + typeof newValue + "] " + childKey + ".");
                    if (defaultValue === null || newValue === null)
                        return "continue";
                    type = typeof defaultValue;
                    if (type === "function") {
                        var oldChildValue_1 = newValue;
                        newValue = function () {
                            var parentFunctionOutput = typeof defaultValue !== "function" ? {} :
                                defaultValue.apply(defaultValue, arguments);
                            var childFunctionOutput = typeof oldChildValue_1 !== "function" ? {} :
                                oldChildValue_1.apply(defaultValue, arguments);
                            return me.mergeOptions(parentFunctionOutput, childFunctionOutput);
                        };
                    }
                    else {
                        newValue = this_1.mergeOptions(defaultValue, newValue);
                    }
                    parent[parentKey] = defaultValue;
                    child[childKey] = newValue;
                };
                var this_1 = this, defaultValue, newValue, type;
                for (var childKey in child) {
                    _loop_1();
                }
            }
            console.log("Merging option object", parent, "with", child);
            var merged = Object.assign(parent, child);
            return merged;
        }
        var result = (typeof newOptions !== "undefined" ? newOptions : defaultOptions);
        return result;
    };
    OptionsHelper.prototype.prepareFileEmitOptionInheritance = function (options) {
        var _this = this;
        var tree = {
            applyInheritance: function (fileEmitOptions) {
                return [
                    {
                        propertyName: "methodEmitOptions",
                        applyInheritance: function (methodEmitOptions) {
                            methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                            methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                        }
                    },
                    {
                        propertyName: "fieldEmitOptions",
                        applyInheritance: function (fieldEmitOptions) {
                            console.log("Merging file members into file.field members");
                            fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                        }
                    },
                    {
                        propertyName: "propertyEmitOptions",
                        applyInheritance: function (propertyEmitOptions) {
                            propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                        }
                    },
                    {
                        propertyName: "namespaceEmitOptions",
                        applyInheritance: function (namespaceEmitOptions) {
                            console.log("Merging file members into file.namespace members");
                            namespaceEmitOptions.classEmitOptions = _this.mergeOptions(fileEmitOptions.classEmitOptions, namespaceEmitOptions.classEmitOptions);
                            namespaceEmitOptions.enumEmitOptions = _this.mergeOptions(fileEmitOptions.enumEmitOptions, namespaceEmitOptions.enumEmitOptions);
                            namespaceEmitOptions.interfaceEmitOptions = _this.mergeOptions(fileEmitOptions.interfaceEmitOptions, namespaceEmitOptions.interfaceEmitOptions);
                            namespaceEmitOptions.structEmitOptions = _this.mergeOptions(fileEmitOptions.structEmitOptions, namespaceEmitOptions.structEmitOptions);
                            return [
                                {
                                    propertyName: "structEmitOptions",
                                    applyInheritance: function (structEmitOptions) {
                                        structEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                        structEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                        structEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                        return [
                                            {
                                                propertyName: "methodEmitOptions",
                                                applyInheritance: function (methodEmitOptions) {
                                                    methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                    methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "propertyEmitOptions",
                                                applyInheritance: function (propertyEmitOptions) {
                                                    propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "fieldEmitOptions",
                                                applyInheritance: function (fieldEmitOptions) {
                                                    fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                }
                                            }
                                        ];
                                    }
                                },
                                {
                                    propertyName: "interfaceEmitOptions",
                                    applyInheritance: function (interfaceEmitOptions) {
                                        interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                        interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                        interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                        interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                        return [
                                            {
                                                propertyName: "methodEmitOptions",
                                                applyInheritance: function (methodEmitOptions) {
                                                    methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                    methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "propertyEmitOptions",
                                                applyInheritance: function (propertyEmitOptions) {
                                                    propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                }
                                            }
                                        ];
                                    }
                                },
                                {
                                    propertyName: "classEmitOptions",
                                    applyInheritance: function (classEmitOptions) {
                                        console.log("Merging file.namespace members into file.namespace.class members");
                                        classEmitOptions.enumEmitOptions = _this.mergeOptions(namespaceEmitOptions.enumEmitOptions, classEmitOptions.enumEmitOptions);
                                        classEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, classEmitOptions.fieldEmitOptions);
                                        classEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, classEmitOptions.genericParameterTypeEmitOptions);
                                        classEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, classEmitOptions.inheritedTypeEmitOptions);
                                        classEmitOptions.interfaceEmitOptions = _this.mergeOptions(namespaceEmitOptions.interfaceEmitOptions, classEmitOptions.interfaceEmitOptions);
                                        classEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, classEmitOptions.methodEmitOptions);
                                        classEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, classEmitOptions.propertyEmitOptions);
                                        classEmitOptions.structEmitOptions = _this.mergeOptions(namespaceEmitOptions.structEmitOptions, classEmitOptions.structEmitOptions);
                                        return [
                                            {
                                                propertyName: "methodEmitOptions",
                                                applyInheritance: function (methodEmitOptions) {
                                                    methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                    methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "propertyEmitOptions",
                                                applyInheritance: function (propertyEmitOptions) {
                                                    propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "fieldEmitOptions",
                                                applyInheritance: function (fieldEmitOptions) {
                                                    console.log("Merging file.namespace.class members into file.namespace.class.field members");
                                                    fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "structEmitOptions",
                                                applyInheritance: function (structEmitOptions) {
                                                    structEmitOptions.fieldEmitOptions = _this.mergeOptions(classEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                                    structEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                                    structEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                                    return [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                            }
                                                        },
                                                        {
                                                            propertyName: "fieldEmitOptions",
                                                            applyInheritance: function (fieldEmitOptions) {
                                                                fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                            }
                                                        }
                                                    ];
                                                }
                                            },
                                            {
                                                propertyName: "interfaceEmitOptions",
                                                applyInheritance: function (interfaceEmitOptions) {
                                                    interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(classEmitOptions.genericParameterTypeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                                    interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(classEmitOptions.inheritedTypeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                                    interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                                    interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                                    return [
                                                        {
                                                            propertyName: "methodEmitOptions",
                                                            applyInheritance: function (methodEmitOptions) {
                                                                methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                                methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                            }
                                                        },
                                                        {
                                                            propertyName: "propertyEmitOptions",
                                                            applyInheritance: function (propertyEmitOptions) {
                                                                propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                            }
                                                        }
                                                    ];
                                                }
                                            }
                                        ];
                                    }
                                }
                            ];
                        }
                    },
                    {
                        propertyName: "structEmitOptions",
                        applyInheritance: function (structEmitOptions) {
                            structEmitOptions.fieldEmitOptions = _this.mergeOptions(fileEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                            structEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                            structEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                            return [
                                {
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: function (methodEmitOptions) {
                                        methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                    }
                                },
                                {
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: function (propertyEmitOptions) {
                                        propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                    }
                                },
                                {
                                    propertyName: "fieldEmitOptions",
                                    applyInheritance: function (fieldEmitOptions) {
                                        fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                    }
                                }
                            ];
                        }
                    },
                    {
                        propertyName: "interfaceEmitOptions",
                        applyInheritance: function (interfaceEmitOptions) {
                            interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                            interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                            interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(fileEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                            interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(fileEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                            return [
                                {
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: function (methodEmitOptions) {
                                        methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                    }
                                },
                                {
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: function (propertyEmitOptions) {
                                        propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                    }
                                }
                            ];
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
                            return [
                                {
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: function (methodEmitOptions) {
                                        methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                    }
                                },
                                {
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: function (propertyEmitOptions, defaultPropertyEmitOptions) {
                                        propertyEmitOptions.perPropertyEmitOptions = function (property) {
                                            return _this.mergeOptions(fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property), defaultPropertyEmitOptions.perPropertyEmitOptions(property));
                                        };
                                        propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                    }
                                },
                                {
                                    propertyName: "fieldEmitOptions",
                                    applyInheritance: function (fieldEmitOptions, defaultFieldEmitOptions) {
                                        fieldEmitOptions.typeEmitOptions.filter = function (type) {
                                            return fileEmitOptions.typeEmitOptions.filter(type) &&
                                                defaultFieldEmitOptions.typeEmitOptions.filter(type);
                                        };
                                        fieldEmitOptions.perFieldEmitOptions = function (field) {
                                            return _this.mergeOptions(fileEmitOptions.fieldEmitOptions.perFieldEmitOptions(field), defaultFieldEmitOptions.perFieldEmitOptions(field));
                                        };
                                        fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                    }
                                },
                                {
                                    propertyName: "structEmitOptions",
                                    applyInheritance: function (structEmitOptions) {
                                        structEmitOptions.fieldEmitOptions = _this.mergeOptions(classEmitOptions.fieldEmitOptions, structEmitOptions.fieldEmitOptions);
                                        structEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, structEmitOptions.methodEmitOptions);
                                        structEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, structEmitOptions.propertyEmitOptions);
                                        return [
                                            {
                                                propertyName: "methodEmitOptions",
                                                applyInheritance: function (methodEmitOptions) {
                                                    methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                    methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "propertyEmitOptions",
                                                applyInheritance: function (propertyEmitOptions) {
                                                    propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "fieldEmitOptions",
                                                applyInheritance: function (fieldEmitOptions) {
                                                    fieldEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, fieldEmitOptions.typeEmitOptions);
                                                }
                                            }
                                        ];
                                    }
                                },
                                {
                                    propertyName: "interfaceEmitOptions",
                                    applyInheritance: function (interfaceEmitOptions) {
                                        interfaceEmitOptions.genericParameterTypeEmitOptions = _this.mergeOptions(classEmitOptions.genericParameterTypeEmitOptions, interfaceEmitOptions.genericParameterTypeEmitOptions);
                                        interfaceEmitOptions.inheritedTypeEmitOptions = _this.mergeOptions(classEmitOptions.inheritedTypeEmitOptions, interfaceEmitOptions.inheritedTypeEmitOptions);
                                        interfaceEmitOptions.methodEmitOptions = _this.mergeOptions(classEmitOptions.methodEmitOptions, interfaceEmitOptions.methodEmitOptions);
                                        interfaceEmitOptions.propertyEmitOptions = _this.mergeOptions(classEmitOptions.propertyEmitOptions, interfaceEmitOptions.propertyEmitOptions);
                                        return [
                                            {
                                                propertyName: "methodEmitOptions",
                                                applyInheritance: function (methodEmitOptions) {
                                                    methodEmitOptions.argumentTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.argumentTypeEmitOptions);
                                                    methodEmitOptions.returnTypeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, methodEmitOptions.returnTypeEmitOptions);
                                                }
                                            },
                                            {
                                                propertyName: "propertyEmitOptions",
                                                applyInheritance: function (propertyEmitOptions) {
                                                    propertyEmitOptions.typeEmitOptions = _this.mergeOptions(fileEmitOptions.typeEmitOptions, propertyEmitOptions.typeEmitOptions);
                                                }
                                            }
                                        ];
                                    }
                                }
                            ];
                        }
                    }
                ];
            }
        };
        var inheritancesToRun = [tree];
        options = this.applyInheritanceTree(options, inheritancesToRun);
        return options;
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
            var newInheritances = inheritance.applyInheritance(property, defaultValue);
            inheritancesToRun.push({
                parent: property,
                tree: newInheritances
            });
        }
        for (var _a = 0, inheritancesToRun_1 = inheritancesToRun; _a < inheritancesToRun_1.length; _a++) {
            var inheritance = inheritancesToRun_1[_a];
            this.applyInheritanceTree(inheritance.parent, inheritance.tree);
        }
        return parent;
    };
    OptionsHelper.prototype.prepareEnumEmitOptionDefaults = function (options) {
        if (!options.filter)
            options.filter = function (classObject) { return classObject.isPublic; };
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
            options.filter = function (field) { return field.isPublic; };
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
            options.filter = function (property) { return property.isPublic; };
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
            options.filter = function (struct) { return struct.isPublic; };
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
            options.filter = function (method) { return method.isPublic; };
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
            options.filter = function (interfaceObject) { return interfaceObject.isPublic; };
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
            options.filter = function (classObject) { return classObject.isPublic; };
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