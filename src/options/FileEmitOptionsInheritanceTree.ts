import { OptionsHelper, OptionsInheritanceTreeNode } from './OptionsHelper';

import { TypeEmitOptions } from '../TypeEmitter';
import { StructEmitOptions, PerStructEmitOptions } from '../StructEmitter';
import { EnumEmitOptions } from '../EnumEmitter';
import { ClassEmitOptions, PerClassEmitOptions } from '../ClassEmitter';
import { InterfaceEmitOptions, PerInterfaceEmitOptions } from '../InterfaceEmitter';
import { NamespaceEmitOptions } from '../NamespaceEmitter';
import { MethodEmitOptions, PerMethodEmitOptions } from '../MethodEmitter';
import { PropertyEmitOptions, PerPropertyEmitOptions } from '../PropertyEmitter';
import { FieldEmitOptions, PerFieldEmitOptions } from '../FieldEmitter';
import { FileEmitOptions } from '../FileEmitter';

var tree = <OptionsInheritanceTreeNode<FileEmitOptions>>{
    applyInheritance: (fileEmitOptions) => {
        return {
            result: fileEmitOptions, tree: [
                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                    propertyName: "methodEmitOptions",
                    applyInheritance: (methodEmitOptions) => {
                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            methodEmitOptions.argumentTypeEmitOptions);
                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            methodEmitOptions.returnTypeEmitOptions);

                        return { result: methodEmitOptions };
                    }
                },
                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                    propertyName: "fieldEmitOptions",
                    applyInheritance: (fieldEmitOptions, defaultFieldEmitOptions) => {
                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            fieldEmitOptions.typeEmitOptions);

                        return {
                            result: fieldEmitOptions, tree: [
                                <OptionsInheritanceTreeNode<TypeEmitOptions>>{
                                    propertyName: "typeEmitOptions",
                                    applyInheritance: (typeEmitOptions, defaultTypeEmitOptions) => {
                                        typeEmitOptions.filter = type =>
                                            fileEmitOptions.typeEmitOptions.filter(type) &&
                                            defaultTypeEmitOptions.filter(type);

                                        return { result: typeEmitOptions };
                                    }
                                }
                            ]
                        };
                    }
                },
                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                    propertyName: "propertyEmitOptions",
                    applyInheritance: (propertyEmitOptions, defaultPropertyEmitOptions) => {
                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            propertyEmitOptions.typeEmitOptions);

                        return { result: propertyEmitOptions };
                    }
                },
                <OptionsInheritanceTreeNode<NamespaceEmitOptions>>{
                    propertyName: "namespaceEmitOptions",
                    applyInheritance: (namespaceEmitOptions) => {
                        namespaceEmitOptions.classEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareClassEmitOptionDefaults({}),
                            fileEmitOptions.classEmitOptions,
                            namespaceEmitOptions.classEmitOptions);
                        namespaceEmitOptions.enumEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareEnumEmitOptionDefaults({}),
                            fileEmitOptions.enumEmitOptions,
                            namespaceEmitOptions.enumEmitOptions);
                        namespaceEmitOptions.interfaceEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareInterfaceEmitOptionDefaults({}),
                            fileEmitOptions.interfaceEmitOptions,
                            namespaceEmitOptions.interfaceEmitOptions);
                        namespaceEmitOptions.structEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareStructEmitOptionDefaults({}),
                            fileEmitOptions.structEmitOptions,
                            namespaceEmitOptions.structEmitOptions);

                        return {
                            result: namespaceEmitOptions, tree: [
                                <OptionsInheritanceTreeNode<StructEmitOptions>>{
                                    propertyName: "structEmitOptions",
                                    applyInheritance: (structEmitOptions) => {
                                        structEmitOptions.fieldEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareFieldEmitOptionDefaults({}),
                                            fileEmitOptions.fieldEmitOptions,
                                            structEmitOptions.fieldEmitOptions);
                                        structEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                            fileEmitOptions.methodEmitOptions,
                                            structEmitOptions.methodEmitOptions);
                                        structEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                            fileEmitOptions.propertyEmitOptions,
                                            structEmitOptions.propertyEmitOptions);

                                        return {
                                            result: structEmitOptions, tree: [
                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: (methodEmitOptions) => {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.returnTypeEmitOptions);

                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: (propertyEmitOptions) => {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            propertyEmitOptions.typeEmitOptions);

                                                        return { result: propertyEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                                                    propertyName: "fieldEmitOptions",
                                                    applyInheritance: (fieldEmitOptions, defaultFieldEmitOptions) => {
                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            fieldEmitOptions.typeEmitOptions);

                                                        return {
                                                            result: fieldEmitOptions, tree: [
                                                                <OptionsInheritanceTreeNode<TypeEmitOptions>>{
                                                                    propertyName: "typeEmitOptions",
                                                                    applyInheritance: (typeEmitOptions, defaultTypeEmitOptions) => {
                                                                        typeEmitOptions.filter = type =>
                                                                            fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                            defaultTypeEmitOptions.filter(type);

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
                                <OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
                                    propertyName: "interfaceEmitOptions",
                                    applyInheritance: (interfaceEmitOptions) => {
                                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            interfaceEmitOptions.genericParameterTypeEmitOptions);
                                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            interfaceEmitOptions.inheritedTypeEmitOptions);
                                        interfaceEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                            fileEmitOptions.methodEmitOptions,
                                            interfaceEmitOptions.methodEmitOptions);
                                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                            fileEmitOptions.propertyEmitOptions,
                                            interfaceEmitOptions.propertyEmitOptions);

                                        return {
                                            result: interfaceEmitOptions, tree: [
                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: (methodEmitOptions) => {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.returnTypeEmitOptions);

                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: (propertyEmitOptions) => {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            propertyEmitOptions.typeEmitOptions);

                                                        return { result: propertyEmitOptions };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                <OptionsInheritanceTreeNode<ClassEmitOptions>>{
                                    propertyName: "classEmitOptions",
                                    applyInheritance: (classEmitOptions) => {
                                        classEmitOptions.enumEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareEnumEmitOptionDefaults({}),
                                            namespaceEmitOptions.enumEmitOptions,
                                            classEmitOptions.enumEmitOptions);
                                        classEmitOptions.fieldEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareFieldEmitOptionDefaults({}),
                                            fileEmitOptions.fieldEmitOptions,
                                            classEmitOptions.fieldEmitOptions);
                                        classEmitOptions.genericParameterTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            classEmitOptions.genericParameterTypeEmitOptions);
                                        classEmitOptions.inheritedTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            classEmitOptions.inheritedTypeEmitOptions);
                                        classEmitOptions.interfaceEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareInterfaceEmitOptionDefaults({}),
                                            namespaceEmitOptions.interfaceEmitOptions,
                                            classEmitOptions.interfaceEmitOptions);
                                        classEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                            fileEmitOptions.methodEmitOptions,
                                            classEmitOptions.methodEmitOptions);
                                        classEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                            fileEmitOptions.propertyEmitOptions,
                                            classEmitOptions.propertyEmitOptions);
                                        classEmitOptions.structEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareStructEmitOptionDefaults({}),
                                            namespaceEmitOptions.structEmitOptions,
                                            classEmitOptions.structEmitOptions);

                                        return {
                                            result: classEmitOptions, tree: [
                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: (methodEmitOptions) => {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.returnTypeEmitOptions);

                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: (propertyEmitOptions) => {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            propertyEmitOptions.typeEmitOptions);

                                                        return { result: propertyEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                                                    propertyName: "fieldEmitOptions",
                                                    applyInheritance: (fieldEmitOptions, defaultFieldEmitOptions) => {
                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            fieldEmitOptions.typeEmitOptions);

                                                        return {
                                                            result: fieldEmitOptions, tree: [
                                                                <OptionsInheritanceTreeNode<TypeEmitOptions>>{
                                                                    propertyName: "typeEmitOptions",
                                                                    applyInheritance: (typeEmitOptions, defaultTypeEmitOptions) => {
                                                                        typeEmitOptions.filter = type =>
                                                                            fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                            defaultTypeEmitOptions.filter(type);

                                                                        return { result: typeEmitOptions };
                                                                    }
                                                                }
                                                            ]
                                                        };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<StructEmitOptions>>{
                                                    propertyName: "structEmitOptions",
                                                    applyInheritance: (structEmitOptions) => {
                                                        structEmitOptions.fieldEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareFieldEmitOptionDefaults({}),
                                                            classEmitOptions.fieldEmitOptions,
                                                            structEmitOptions.fieldEmitOptions);
                                                        structEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                                            classEmitOptions.methodEmitOptions,
                                                            structEmitOptions.methodEmitOptions);
                                                        structEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                                            classEmitOptions.propertyEmitOptions,
                                                            structEmitOptions.propertyEmitOptions);

                                                        return {
                                                            result: structEmitOptions, tree: [
                                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                                    propertyName: "methodEmitOptions",
                                                                    applyInheritance: (methodEmitOptions) => {
                                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            methodEmitOptions.returnTypeEmitOptions);

                                                                        return { result: methodEmitOptions };
                                                                    }
                                                                },
                                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                                    propertyName: "propertyEmitOptions",
                                                                    applyInheritance: (propertyEmitOptions) => {
                                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            propertyEmitOptions.typeEmitOptions);

                                                                        return { result: propertyEmitOptions };
                                                                    }
                                                                },
                                                                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                                                                    propertyName: "fieldEmitOptions",
                                                                    applyInheritance: (fieldEmitOptions) => {
                                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            fieldEmitOptions.typeEmitOptions);

                                                                        return {
                                                                            result: fieldEmitOptions, tree: [
                                                                                <OptionsInheritanceTreeNode<TypeEmitOptions>>{
                                                                                    propertyName: "typeEmitOptions",
                                                                                    applyInheritance: (typeEmitOptions, defaultTypeEmitOptions) => {
                                                                                        typeEmitOptions.filter = type =>
                                                                                            fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                                            defaultTypeEmitOptions.filter(type);

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
                                                <OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
                                                    propertyName: "interfaceEmitOptions",
                                                    applyInheritance: (interfaceEmitOptions) => {
                                                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            classEmitOptions.genericParameterTypeEmitOptions,
                                                            interfaceEmitOptions.genericParameterTypeEmitOptions);
                                                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            classEmitOptions.inheritedTypeEmitOptions,
                                                            interfaceEmitOptions.inheritedTypeEmitOptions);
                                                        interfaceEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                                            classEmitOptions.methodEmitOptions,
                                                            interfaceEmitOptions.methodEmitOptions);
                                                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                                            classEmitOptions.propertyEmitOptions,
                                                            interfaceEmitOptions.propertyEmitOptions);

                                                        return {
                                                            result: interfaceEmitOptions, tree: [
                                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                                    propertyName: "methodEmitOptions",
                                                                    applyInheritance: (methodEmitOptions) => {
                                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            methodEmitOptions.returnTypeEmitOptions);

                                                                        return { result: methodEmitOptions };
                                                                    }
                                                                },
                                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                                    propertyName: "propertyEmitOptions",
                                                                    applyInheritance: (propertyEmitOptions) => {
                                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                                            fileEmitOptions.typeEmitOptions,
                                                                            propertyEmitOptions.typeEmitOptions);

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
                <OptionsInheritanceTreeNode<StructEmitOptions>>{
                    propertyName: "structEmitOptions",
                    applyInheritance: (structEmitOptions) => {
                        structEmitOptions.fieldEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareFieldEmitOptionDefaults({}),
                            fileEmitOptions.fieldEmitOptions,
                            structEmitOptions.fieldEmitOptions);
                        structEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                            fileEmitOptions.methodEmitOptions,
                            structEmitOptions.methodEmitOptions);
                        structEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                            fileEmitOptions.propertyEmitOptions,
                            structEmitOptions.propertyEmitOptions);

                        return {
                            result: structEmitOptions, tree: [
                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: (methodEmitOptions) => {
                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            methodEmitOptions.returnTypeEmitOptions);

                                        return { result: methodEmitOptions };
                                    }
                                },
                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: (propertyEmitOptions) => {
                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            propertyEmitOptions.typeEmitOptions);

                                        return { result: propertyEmitOptions };
                                    }
                                },
                                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                                    propertyName: "fieldEmitOptions",
                                    applyInheritance: (fieldEmitOptions) => {
                                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            fieldEmitOptions.typeEmitOptions);

                                        return { result: fieldEmitOptions };
                                    }
                                }
                            ]
                        };
                    }
                },
                <OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
                    propertyName: "interfaceEmitOptions",
                    applyInheritance: (interfaceEmitOptions) => {
                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            interfaceEmitOptions.genericParameterTypeEmitOptions);
                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            interfaceEmitOptions.inheritedTypeEmitOptions);
                        interfaceEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                            fileEmitOptions.methodEmitOptions,
                            interfaceEmitOptions.methodEmitOptions);
                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                            fileEmitOptions.propertyEmitOptions,
                            interfaceEmitOptions.propertyEmitOptions);

                        return {
                            result: interfaceEmitOptions, tree: [
                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: (methodEmitOptions) => {
                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            methodEmitOptions.returnTypeEmitOptions);

                                        return { result: methodEmitOptions };
                                    }
                                },
                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: (propertyEmitOptions) => {
                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            propertyEmitOptions.typeEmitOptions);

                                        return { result: propertyEmitOptions };
                                    }
                                }
                            ]
                        };
                    }
                },
                <OptionsInheritanceTreeNode<ClassEmitOptions>>{
                    propertyName: "classEmitOptions",
                    applyInheritance: (classEmitOptions) => {
                        classEmitOptions.enumEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareEnumEmitOptionDefaults({}),
                            fileEmitOptions.enumEmitOptions,
                            classEmitOptions.enumEmitOptions);
                        classEmitOptions.fieldEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareFieldEmitOptionDefaults({}),
                            fileEmitOptions.fieldEmitOptions,
                            classEmitOptions.fieldEmitOptions);
                        classEmitOptions.genericParameterTypeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            classEmitOptions.genericParameterTypeEmitOptions);
                        classEmitOptions.inheritedTypeEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                            fileEmitOptions.typeEmitOptions,
                            classEmitOptions.inheritedTypeEmitOptions);
                        classEmitOptions.interfaceEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareInterfaceEmitOptionDefaults({}),
                            fileEmitOptions.interfaceEmitOptions,
                            classEmitOptions.interfaceEmitOptions);
                        classEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                            fileEmitOptions.methodEmitOptions,
                            classEmitOptions.methodEmitOptions);
                        classEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                            fileEmitOptions.propertyEmitOptions,
                            classEmitOptions.propertyEmitOptions);
                        classEmitOptions.structEmitOptions = OptionsHelper.mergeOptions(
                            OptionsHelper.prepareStructEmitOptionDefaults({}),
                            fileEmitOptions.structEmitOptions,
                            classEmitOptions.structEmitOptions);

                        return {
                            result: classEmitOptions, tree: [
                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                    propertyName: "methodEmitOptions",
                                    applyInheritance: (methodEmitOptions) => {
                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            methodEmitOptions.argumentTypeEmitOptions);
                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            methodEmitOptions.returnTypeEmitOptions);

                                        return { result: methodEmitOptions };
                                    }
                                },
                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                    propertyName: "propertyEmitOptions",
                                    applyInheritance: (propertyEmitOptions, defaultPropertyEmitOptions) => {
                                        propertyEmitOptions.perPropertyEmitOptions = property =>
                                            OptionsHelper.mergeOptions(
                                                OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                                fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property),
                                                defaultPropertyEmitOptions.perPropertyEmitOptions(property));

                                        propertyEmitOptions.perPropertyEmitOptions = property =>
                                            OptionsHelper.mergeOptions(
                                                OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                                fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property),
                                                defaultPropertyEmitOptions.perPropertyEmitOptions(property));

                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            propertyEmitOptions.typeEmitOptions);

                                        return { result: propertyEmitOptions };
                                    }
                                },
                                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                                    propertyName: "fieldEmitOptions",
                                    applyInheritance: (fieldEmitOptions, defaultFieldEmitOptions) => {
                                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            fileEmitOptions.typeEmitOptions,
                                            fieldEmitOptions.typeEmitOptions);

                                        fieldEmitOptions.perFieldEmitOptions = field =>
                                            OptionsHelper.mergeOptions(
                                                OptionsHelper.prepareFieldEmitOptionDefaults({}),
                                                fileEmitOptions.fieldEmitOptions.perFieldEmitOptions(field),
                                                defaultFieldEmitOptions.perFieldEmitOptions(field));

                                        return {
                                            result: fieldEmitOptions, tree: [
                                                <OptionsInheritanceTreeNode<TypeEmitOptions>>{
                                                    propertyName: "typeEmitOptions",
                                                    applyInheritance: (typeEmitOptions, defaultTypeEmitOptions) => {
                                                        typeEmitOptions.filter = type =>
                                                            fileEmitOptions.typeEmitOptions.filter(type) &&
                                                            defaultTypeEmitOptions.filter(type);

                                                        return { result: typeEmitOptions };
                                                    }
                                                }
                                            ]
                                        };
                                    }
                                },
                                <OptionsInheritanceTreeNode<StructEmitOptions>>{
                                    propertyName: "structEmitOptions",
                                    applyInheritance: (structEmitOptions) => {
                                        structEmitOptions.fieldEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareFieldEmitOptionDefaults({}),
                                            classEmitOptions.fieldEmitOptions,
                                            structEmitOptions.fieldEmitOptions);
                                        structEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                            classEmitOptions.methodEmitOptions,
                                            structEmitOptions.methodEmitOptions);
                                        structEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                            classEmitOptions.propertyEmitOptions,
                                            structEmitOptions.propertyEmitOptions);

                                        return {
                                            result: structEmitOptions, tree: [
                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: (methodEmitOptions) => {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.returnTypeEmitOptions);

                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: (propertyEmitOptions) => {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            propertyEmitOptions.typeEmitOptions);

                                                        return { result: propertyEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<FieldEmitOptions>>{
                                                    propertyName: "fieldEmitOptions",
                                                    applyInheritance: (fieldEmitOptions) => {
                                                        fieldEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            fieldEmitOptions.typeEmitOptions);

                                                        return {
                                                            result: fieldEmitOptions, tree: [
                                                                <OptionsInheritanceTreeNode<TypeEmitOptions>>{
                                                                    propertyName: "typeEmitOptions",
                                                                    applyInheritance: (typeEmitOptions, defaultTypeEmitOptions) => {
                                                                        typeEmitOptions.filter = type =>
                                                                            fileEmitOptions.typeEmitOptions.filter(type) &&
                                                                            defaultTypeEmitOptions.filter(type);

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
                                <OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
                                    propertyName: "interfaceEmitOptions",
                                    applyInheritance: (interfaceEmitOptions) => {
                                        interfaceEmitOptions.genericParameterTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            classEmitOptions.genericParameterTypeEmitOptions,
                                            interfaceEmitOptions.genericParameterTypeEmitOptions);
                                        interfaceEmitOptions.inheritedTypeEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                            classEmitOptions.inheritedTypeEmitOptions,
                                            interfaceEmitOptions.inheritedTypeEmitOptions);
                                        interfaceEmitOptions.methodEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.prepareMethodEmitOptionDefaults({}),
                                            classEmitOptions.methodEmitOptions,
                                            interfaceEmitOptions.methodEmitOptions);
                                        interfaceEmitOptions.propertyEmitOptions = OptionsHelper.mergeOptions(
                                            OptionsHelper.preparePropertyEmitOptionDefaults({}),
                                            classEmitOptions.propertyEmitOptions,
                                            interfaceEmitOptions.propertyEmitOptions);

                                        return {
                                            result: interfaceEmitOptions, tree: [
                                                <OptionsInheritanceTreeNode<MethodEmitOptions>>{
                                                    propertyName: "methodEmitOptions",
                                                    applyInheritance: (methodEmitOptions) => {
                                                        methodEmitOptions.argumentTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.argumentTypeEmitOptions);
                                                        methodEmitOptions.returnTypeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            methodEmitOptions.returnTypeEmitOptions);

                                                        return { result: methodEmitOptions };
                                                    }
                                                },
                                                <OptionsInheritanceTreeNode<PropertyEmitOptions>>{
                                                    propertyName: "propertyEmitOptions",
                                                    applyInheritance: (propertyEmitOptions) => {
                                                        propertyEmitOptions.typeEmitOptions = OptionsHelper.mergeOptions(
                                                            OptionsHelper.prepareTypeEmitOptionDefaults({}),
                                                            fileEmitOptions.typeEmitOptions,
                                                            propertyEmitOptions.typeEmitOptions);

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

export { tree as fileEmitOptionsInheritanceTree};