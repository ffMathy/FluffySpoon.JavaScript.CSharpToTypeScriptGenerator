import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitOptions, PerStructEmitOptions } from './StructEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions, PerClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions, PerInterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions, PerMethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions, PerPropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions, PerFieldEmitOptions } from './FieldEmitter';
import { FileEmitOptions } from './FileEmitter';

//for this to work, we need our option objects to be classes, not interfaces.
export interface OptionsInheritanceTreeNode<T> {
    propertyName?: string;
    applyInheritance?: (parent: T, defaultValue?: T) => OptionsInheritanceTreeNode<any>[]|null;
}

export class OptionsHelper {

	private mergeOptions<T extends Object, K extends Object>(
		defaultOptions: T, 
		newOptions: K): T&K 
	{
        let me = this;

        if(!Array.isArray(defaultOptions) && !Array.isArray(newOptions) && typeof defaultOptions === "object" && typeof newOptions === "object") {
            var parent = Object.assign({}, defaultOptions);
            var child = Object.assign({}, newOptions);

            for(var parentKey in parent)
            for(var childKey in child) {
                if(!parent.hasOwnProperty(parentKey)) continue;
                if(!child.hasOwnProperty(childKey)) continue;

                if(parentKey.toString() !== childKey.toString()) continue;

                var defaultValue = <any>parent[parentKey];
				if(typeof defaultValue !== "undefined" && typeof defaultValue !== "object" && typeof defaultValue !== "function")
					continue;

                var newValue = <any>child[childKey];
                if(typeof defaultValue !== typeof newValue)
                    throw new Error("Could not merge options [" + typeof defaultValue + "] " + parentKey + " and [" + typeof newValue + "] " + childKey + ".");

                if(defaultValue === null || newValue === null) 
                    continue;

                var type = typeof defaultValue;
                if(type === "function") {
                    let oldChildValue = newValue;
                    newValue = function() {
                        var parentFunctionOutput = typeof defaultValue !== "function" ? {} : 
							(defaultValue as Function).apply(defaultValue, arguments);
                        var childFunctionOutput = typeof oldChildValue !== "function" ? {} : 
							(oldChildValue as Function).apply(defaultValue, arguments);
                        return me.mergeOptions(parentFunctionOutput, childFunctionOutput);
                    };
                } else {
                    newValue = this.mergeOptions(defaultValue, newValue);
                }

                parent[parentKey] = defaultValue;
                child[childKey] = newValue;
            }

            console.log("Merging option object", parent, "with", child);

            var merged = Object.assign(
                parent,
                child);
            return merged;
        }

        var result = <any>(typeof newOptions !== "undefined" ? newOptions : defaultOptions);
        return result;
    }

    prepareFileEmitOptionInheritance(options: FileEmitOptions) {
        var tree = <OptionsInheritanceTreeNode<FileEmitOptions>>{
            applyInheritance: (fileEmitOptions) => {
                return [
					<OptionsInheritanceTreeNode<MethodEmitOptions>>{
						propertyName: "methodEmitOptions",
						applyInheritance: (methodEmitOptions) => {
							methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								methodEmitOptions.argumentTypeEmitOptions);
							methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								methodEmitOptions.returnTypeEmitOptions);
						}
					},
					<OptionsInheritanceTreeNode<FieldEmitOptions>>{
						propertyName: "fieldEmitOptions",
						applyInheritance: (fieldEmitOptions) => {
							console.log("Merging file members into file.field members");

							fieldEmitOptions.typeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								fieldEmitOptions.typeEmitOptions);
						}
					},
					<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
						propertyName: "propertyEmitOptions",
						applyInheritance: (propertyEmitOptions) => {
							propertyEmitOptions.typeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								propertyEmitOptions.typeEmitOptions);
						}
					},
					<OptionsInheritanceTreeNode<NamespaceEmitOptions>>{
						propertyName: "namespaceEmitOptions",
						applyInheritance: (namespaceEmitOptions) => {
							console.log("Merging file members into file.namespace members");

							namespaceEmitOptions.classEmitOptions = this.mergeOptions(
								fileEmitOptions.classEmitOptions,
								namespaceEmitOptions.classEmitOptions);
							namespaceEmitOptions.enumEmitOptions = this.mergeOptions(
								fileEmitOptions.enumEmitOptions,
								namespaceEmitOptions.enumEmitOptions);
							namespaceEmitOptions.interfaceEmitOptions = this.mergeOptions(
								fileEmitOptions.interfaceEmitOptions,
								namespaceEmitOptions.interfaceEmitOptions);
							namespaceEmitOptions.structEmitOptions = this.mergeOptions(
								fileEmitOptions.structEmitOptions,
								namespaceEmitOptions.structEmitOptions);

							return [
								<OptionsInheritanceTreeNode<StructEmitOptions>>{
									propertyName: "structEmitOptions",
									applyInheritance: (structEmitOptions) => {
										structEmitOptions.fieldEmitOptions = this.mergeOptions(
											fileEmitOptions.fieldEmitOptions,
											structEmitOptions.fieldEmitOptions);
										structEmitOptions.methodEmitOptions = this.mergeOptions(
											fileEmitOptions.methodEmitOptions,
											structEmitOptions.methodEmitOptions);
										structEmitOptions.propertyEmitOptions = this.mergeOptions(
											fileEmitOptions.propertyEmitOptions,
											structEmitOptions.propertyEmitOptions);

										return [
											<OptionsInheritanceTreeNode<MethodEmitOptions>>{
												propertyName: "methodEmitOptions",
												applyInheritance: (methodEmitOptions) => {
													methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.argumentTypeEmitOptions);
													methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.returnTypeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
												propertyName: "propertyEmitOptions",
												applyInheritance: (propertyEmitOptions) => {
													propertyEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														propertyEmitOptions.typeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<FieldEmitOptions>>{
												propertyName: "fieldEmitOptions",
												applyInheritance: (fieldEmitOptions) => {
													fieldEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														fieldEmitOptions.typeEmitOptions);
												}
											}
										];
									}
								},
								<OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
									propertyName: "interfaceEmitOptions",
									applyInheritance: (interfaceEmitOptions) => {
										interfaceEmitOptions.genericParameterTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											interfaceEmitOptions.genericParameterTypeEmitOptions);
										interfaceEmitOptions.inheritedTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											interfaceEmitOptions.inheritedTypeEmitOptions);
										interfaceEmitOptions.methodEmitOptions = this.mergeOptions(
											fileEmitOptions.methodEmitOptions,
											interfaceEmitOptions.methodEmitOptions);
										interfaceEmitOptions.propertyEmitOptions = this.mergeOptions(
											fileEmitOptions.propertyEmitOptions,
											interfaceEmitOptions.propertyEmitOptions);

										return [
											<OptionsInheritanceTreeNode<MethodEmitOptions>>{
												propertyName: "methodEmitOptions",
												applyInheritance: (methodEmitOptions) => {
													methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.argumentTypeEmitOptions);
													methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.returnTypeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
												propertyName: "propertyEmitOptions",
												applyInheritance: (propertyEmitOptions) => {
													propertyEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														propertyEmitOptions.typeEmitOptions);
												}
											}
										];
									}
								},
								<OptionsInheritanceTreeNode<ClassEmitOptions>>{
									propertyName: "classEmitOptions",
									applyInheritance: (classEmitOptions) => {
										console.log("Merging file.namespace members into file.namespace.class members");
							
										classEmitOptions.enumEmitOptions = this.mergeOptions(
											namespaceEmitOptions.enumEmitOptions,
											classEmitOptions.enumEmitOptions);
										classEmitOptions.fieldEmitOptions = this.mergeOptions(
											fileEmitOptions.fieldEmitOptions,
											classEmitOptions.fieldEmitOptions);
										classEmitOptions.genericParameterTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											classEmitOptions.genericParameterTypeEmitOptions);
										classEmitOptions.inheritedTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											classEmitOptions.inheritedTypeEmitOptions);
										classEmitOptions.interfaceEmitOptions = this.mergeOptions(
											namespaceEmitOptions.interfaceEmitOptions,
											classEmitOptions.interfaceEmitOptions);
										classEmitOptions.methodEmitOptions = this.mergeOptions(
											fileEmitOptions.methodEmitOptions,
											classEmitOptions.methodEmitOptions);
										classEmitOptions.propertyEmitOptions = this.mergeOptions(
											fileEmitOptions.propertyEmitOptions,
											classEmitOptions.propertyEmitOptions);
										classEmitOptions.structEmitOptions = this.mergeOptions(
											namespaceEmitOptions.structEmitOptions,
											classEmitOptions.structEmitOptions);

										return [
											<OptionsInheritanceTreeNode<MethodEmitOptions>>{
												propertyName: "methodEmitOptions",
												applyInheritance: (methodEmitOptions) => {
													methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.argumentTypeEmitOptions);
													methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.returnTypeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
												propertyName: "propertyEmitOptions",
												applyInheritance: (propertyEmitOptions) => {
													propertyEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														propertyEmitOptions.typeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<FieldEmitOptions>>{
												propertyName: "fieldEmitOptions",
												applyInheritance: (fieldEmitOptions) => {
													console.log("Merging file.namespace.class members into file.namespace.class.field members");

													fieldEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														fieldEmitOptions.typeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<StructEmitOptions>>{
												propertyName: "structEmitOptions",
												applyInheritance: (structEmitOptions) => {
													structEmitOptions.fieldEmitOptions = this.mergeOptions(
														classEmitOptions.fieldEmitOptions,
														structEmitOptions.fieldEmitOptions);
													structEmitOptions.methodEmitOptions = this.mergeOptions(
														classEmitOptions.methodEmitOptions,
														structEmitOptions.methodEmitOptions);
													structEmitOptions.propertyEmitOptions = this.mergeOptions(
														classEmitOptions.propertyEmitOptions,
														structEmitOptions.propertyEmitOptions);

													return [
														<OptionsInheritanceTreeNode<MethodEmitOptions>>{
															propertyName: "methodEmitOptions",
															applyInheritance: (methodEmitOptions) => {
																methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	methodEmitOptions.argumentTypeEmitOptions);
																methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	methodEmitOptions.returnTypeEmitOptions);
															}
														},
														<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
															propertyName: "propertyEmitOptions",
															applyInheritance: (propertyEmitOptions) => {
																propertyEmitOptions.typeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	propertyEmitOptions.typeEmitOptions);
															}
														},
														<OptionsInheritanceTreeNode<FieldEmitOptions>>{
															propertyName: "fieldEmitOptions",
															applyInheritance: (fieldEmitOptions) => {
																fieldEmitOptions.typeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	fieldEmitOptions.typeEmitOptions);
															}
														}
													];
												}
											},
											<OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
												propertyName: "interfaceEmitOptions",
												applyInheritance: (interfaceEmitOptions) => {
													interfaceEmitOptions.genericParameterTypeEmitOptions = this.mergeOptions(
														classEmitOptions.genericParameterTypeEmitOptions,
														interfaceEmitOptions.genericParameterTypeEmitOptions);
													interfaceEmitOptions.inheritedTypeEmitOptions = this.mergeOptions(
														classEmitOptions.inheritedTypeEmitOptions,
														interfaceEmitOptions.inheritedTypeEmitOptions);
													interfaceEmitOptions.methodEmitOptions = this.mergeOptions(
														classEmitOptions.methodEmitOptions,
														interfaceEmitOptions.methodEmitOptions);
													interfaceEmitOptions.propertyEmitOptions = this.mergeOptions(
														classEmitOptions.propertyEmitOptions,
														interfaceEmitOptions.propertyEmitOptions);

													return [
														<OptionsInheritanceTreeNode<MethodEmitOptions>>{
															propertyName: "methodEmitOptions",
															applyInheritance: (methodEmitOptions) => {
																methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	methodEmitOptions.argumentTypeEmitOptions);
																methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	methodEmitOptions.returnTypeEmitOptions);
															}
														},
														<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
															propertyName: "propertyEmitOptions",
															applyInheritance: (propertyEmitOptions) => {
																propertyEmitOptions.typeEmitOptions = this.mergeOptions(
																	fileEmitOptions.typeEmitOptions,
																	propertyEmitOptions.typeEmitOptions);
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
					<OptionsInheritanceTreeNode<StructEmitOptions>>{
						propertyName: "structEmitOptions",
						applyInheritance: (structEmitOptions) => {
							structEmitOptions.fieldEmitOptions = this.mergeOptions(
								fileEmitOptions.fieldEmitOptions,
								structEmitOptions.fieldEmitOptions);
							structEmitOptions.methodEmitOptions = this.mergeOptions(
								fileEmitOptions.methodEmitOptions,
								structEmitOptions.methodEmitOptions);
							structEmitOptions.propertyEmitOptions = this.mergeOptions(
								fileEmitOptions.propertyEmitOptions,
								structEmitOptions.propertyEmitOptions);

							return [
								<OptionsInheritanceTreeNode<MethodEmitOptions>>{
									propertyName: "methodEmitOptions",
									applyInheritance: (methodEmitOptions) => {
										methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											methodEmitOptions.argumentTypeEmitOptions);
										methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											methodEmitOptions.returnTypeEmitOptions);
									}
								},
								<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
									propertyName: "propertyEmitOptions",
									applyInheritance: (propertyEmitOptions) => {
										propertyEmitOptions.typeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											propertyEmitOptions.typeEmitOptions);
									}
								},
								<OptionsInheritanceTreeNode<FieldEmitOptions>>{
									propertyName: "fieldEmitOptions",
									applyInheritance: (fieldEmitOptions) => {
										fieldEmitOptions.typeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											fieldEmitOptions.typeEmitOptions);
									}
								}
							];
						}
					},
					<OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
						propertyName: "interfaceEmitOptions",
						applyInheritance: (interfaceEmitOptions) => {
							interfaceEmitOptions.genericParameterTypeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								interfaceEmitOptions.genericParameterTypeEmitOptions);
							interfaceEmitOptions.inheritedTypeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								interfaceEmitOptions.inheritedTypeEmitOptions);
							interfaceEmitOptions.methodEmitOptions = this.mergeOptions(
								fileEmitOptions.methodEmitOptions,
								interfaceEmitOptions.methodEmitOptions);
							interfaceEmitOptions.propertyEmitOptions = this.mergeOptions(
								fileEmitOptions.propertyEmitOptions,
								interfaceEmitOptions.propertyEmitOptions);

							return [
								<OptionsInheritanceTreeNode<MethodEmitOptions>>{
									propertyName: "methodEmitOptions",
									applyInheritance: (methodEmitOptions) => {
										methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											methodEmitOptions.argumentTypeEmitOptions);
										methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											methodEmitOptions.returnTypeEmitOptions);
									}
								},
								<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
									propertyName: "propertyEmitOptions",
									applyInheritance: (propertyEmitOptions) => {
										propertyEmitOptions.typeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											propertyEmitOptions.typeEmitOptions);
									}
								}
							];
						}
					},
					<OptionsInheritanceTreeNode<ClassEmitOptions>>{
						propertyName: "classEmitOptions",
						applyInheritance: (classEmitOptions) => {
							classEmitOptions.enumEmitOptions = this.mergeOptions(
								fileEmitOptions.enumEmitOptions,
								classEmitOptions.enumEmitOptions);
							classEmitOptions.fieldEmitOptions = this.mergeOptions(
								fileEmitOptions.fieldEmitOptions,
								classEmitOptions.fieldEmitOptions);
							classEmitOptions.genericParameterTypeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								classEmitOptions.genericParameterTypeEmitOptions);
							classEmitOptions.inheritedTypeEmitOptions = this.mergeOptions(
								fileEmitOptions.typeEmitOptions,
								classEmitOptions.inheritedTypeEmitOptions);
							classEmitOptions.interfaceEmitOptions = this.mergeOptions(
								fileEmitOptions.interfaceEmitOptions,
								classEmitOptions.interfaceEmitOptions);
							classEmitOptions.methodEmitOptions = this.mergeOptions(
								fileEmitOptions.methodEmitOptions,
								classEmitOptions.methodEmitOptions);
							classEmitOptions.propertyEmitOptions = this.mergeOptions(
								fileEmitOptions.propertyEmitOptions,
								classEmitOptions.propertyEmitOptions);
							classEmitOptions.structEmitOptions = this.mergeOptions(
								fileEmitOptions.structEmitOptions,
								classEmitOptions.structEmitOptions);

							return [
								<OptionsInheritanceTreeNode<MethodEmitOptions>>{
									propertyName: "methodEmitOptions",
									applyInheritance: (methodEmitOptions) => {
										methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											methodEmitOptions.argumentTypeEmitOptions);
										methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											methodEmitOptions.returnTypeEmitOptions);
									}
								},
								<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
									propertyName: "propertyEmitOptions",
									applyInheritance: (propertyEmitOptions, defaultPropertyEmitOptions) => {
										propertyEmitOptions.perPropertyEmitOptions = property => 
											this.mergeOptions(
												fileEmitOptions.propertyEmitOptions.perPropertyEmitOptions(property),
												defaultPropertyEmitOptions.perPropertyEmitOptions(property));

										propertyEmitOptions.typeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											propertyEmitOptions.typeEmitOptions);
									}
								},
								<OptionsInheritanceTreeNode<FieldEmitOptions>>{
									propertyName: "fieldEmitOptions",
									applyInheritance: (fieldEmitOptions, defaultFieldEmitOptions) => {
										fieldEmitOptions.typeEmitOptions.filter = type => 
											fileEmitOptions.typeEmitOptions.filter(type) &&
											defaultFieldEmitOptions.typeEmitOptions.filter(type);

										fieldEmitOptions.perFieldEmitOptions = field => 
											this.mergeOptions(
												fileEmitOptions.fieldEmitOptions.perFieldEmitOptions(field),
												defaultFieldEmitOptions.perFieldEmitOptions(field));

										fieldEmitOptions.typeEmitOptions = this.mergeOptions(
											fileEmitOptions.typeEmitOptions,
											fieldEmitOptions.typeEmitOptions);
									}
								},
								<OptionsInheritanceTreeNode<StructEmitOptions>>{
									propertyName: "structEmitOptions",
									applyInheritance: (structEmitOptions) => {
										structEmitOptions.fieldEmitOptions = this.mergeOptions(
											classEmitOptions.fieldEmitOptions,
											structEmitOptions.fieldEmitOptions);
										structEmitOptions.methodEmitOptions = this.mergeOptions(
											classEmitOptions.methodEmitOptions,
											structEmitOptions.methodEmitOptions);
										structEmitOptions.propertyEmitOptions = this.mergeOptions(
											classEmitOptions.propertyEmitOptions,
											structEmitOptions.propertyEmitOptions);

										return [
											<OptionsInheritanceTreeNode<MethodEmitOptions>>{
												propertyName: "methodEmitOptions",
												applyInheritance: (methodEmitOptions) => {
													methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.argumentTypeEmitOptions);
													methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.returnTypeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
												propertyName: "propertyEmitOptions",
												applyInheritance: (propertyEmitOptions) => {
													propertyEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														propertyEmitOptions.typeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<FieldEmitOptions>>{
												propertyName: "fieldEmitOptions",
												applyInheritance: (fieldEmitOptions) => {
													fieldEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														fieldEmitOptions.typeEmitOptions);
												}
											}
										];
									}
								},
								<OptionsInheritanceTreeNode<InterfaceEmitOptions>>{
									propertyName: "interfaceEmitOptions",
									applyInheritance: (interfaceEmitOptions) => {
										interfaceEmitOptions.genericParameterTypeEmitOptions = this.mergeOptions(
											classEmitOptions.genericParameterTypeEmitOptions,
											interfaceEmitOptions.genericParameterTypeEmitOptions);
										interfaceEmitOptions.inheritedTypeEmitOptions = this.mergeOptions(
											classEmitOptions.inheritedTypeEmitOptions,
											interfaceEmitOptions.inheritedTypeEmitOptions);
										interfaceEmitOptions.methodEmitOptions = this.mergeOptions(
											classEmitOptions.methodEmitOptions,
											interfaceEmitOptions.methodEmitOptions);
										interfaceEmitOptions.propertyEmitOptions = this.mergeOptions(
											classEmitOptions.propertyEmitOptions,
											interfaceEmitOptions.propertyEmitOptions);

										return [
											<OptionsInheritanceTreeNode<MethodEmitOptions>>{
												propertyName: "methodEmitOptions",
												applyInheritance: (methodEmitOptions) => {
													methodEmitOptions.argumentTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.argumentTypeEmitOptions);
													methodEmitOptions.returnTypeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														methodEmitOptions.returnTypeEmitOptions);
												}
											},
											<OptionsInheritanceTreeNode<PropertyEmitOptions>>{
												propertyName: "propertyEmitOptions",
												applyInheritance: (propertyEmitOptions) => {
													propertyEmitOptions.typeEmitOptions = this.mergeOptions(
														fileEmitOptions.typeEmitOptions,
														propertyEmitOptions.typeEmitOptions);
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
    }

	private applyInheritanceTree(parent: Object, tree: OptionsInheritanceTreeNode<any>[]) {
		if(!tree)
			return parent;

		var inheritancesToRun = <{parent: Object, tree: OptionsInheritanceTreeNode<any>[]}[]>[];
		for(let inheritance of tree) {
			if(inheritance.propertyName && !parent[inheritance.propertyName])
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

		for(let inheritance of inheritancesToRun) {
			this.applyInheritanceTree(inheritance.parent, inheritance.tree);
		}

		return parent;
	}
	
	prepareEnumEmitOptionDefaults(options: EnumEmitOptions) {
		if(!options.filter)
			options.filter = (classObject) => classObject.isPublic;

		if (!options.strategy) {
			options.strategy = "default";
		}

		return options;
	}
	
	prepareTypeEmitOptionDefaults(options: TypeEmitOptions) {
		if (!options.filter) {
			options.filter = (type) => true;
		}

		return options;
	}
	
	prepareFieldEmitOptionDefaults(options: FieldEmitOptions) {
		if(!options.typeEmitOptions) options.typeEmitOptions = {};

		if (!options.filter) {
			options.filter = (field) => field.isPublic;
		}

		if (!options.perFieldEmitOptions) {
			options.perFieldEmitOptions = () => options;
		}
		
		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		return options;
	}
	
	preparePropertyEmitOptionDefaults(options: PropertyEmitOptions) {
		if(!options.typeEmitOptions) options.typeEmitOptions = {};

		if (!options.filter) {
			options.filter = (property) => property.isPublic;
		}

		if (!options.perPropertyEmitOptions) {
			options.perPropertyEmitOptions = (property) => <PerPropertyEmitOptions>{
				name: property.name.charAt(0).toLowerCase() + property.name.substring(1)
			};
		}
		
		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		return options;
	}
	
	prepareStructEmitOptionDefaults(options: StructEmitOptions) {
		if(!options.methodEmitOptions) options.methodEmitOptions = {};
		if(!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if(!options.fieldEmitOptions) options.fieldEmitOptions = {};

		if (!options.filter) {
			options.filter = (struct) => struct.isPublic;
		}

		if (!options.perStructEmitOptions) {
			options.perStructEmitOptions = () => options;
		}
		
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);

		return options;
	}
	
	prepareMethodEmitOptionDefaults(options: MethodEmitOptions) {
		if(!options.argumentTypeEmitOptions) options.argumentTypeEmitOptions = {};
		if(!options.returnTypeEmitOptions) options.returnTypeEmitOptions = {};

		if (!options.filter) {
			options.filter = (method) => method.isPublic;
		}

		if (!options.perMethodEmitOptions) {
			options.perMethodEmitOptions = () => options;
		}
		
		options.argumentTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.argumentTypeEmitOptions);
		options.returnTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.returnTypeEmitOptions);

		return options;
	}
	
	prepareInterfaceEmitOptionDefaults(options: InterfaceEmitOptions) {
		if(!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if(!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if(!options.methodEmitOptions) options.methodEmitOptions = {};
		if(!options.propertyEmitOptions) options.propertyEmitOptions = {};

		if (!options.filter) {
			options.filter = (interfaceObject) => interfaceObject.isPublic;
		}

		if (!options.perInterfaceEmitOptions) {
			options.perInterfaceEmitOptions = () => options;
		}

		options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
		options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);

		return options;
	}
	
	prepareNamespaceEmitOptionDefaults(options: NamespaceEmitOptions) {
		if(!options.enumEmitOptions) options.enumEmitOptions = {};
		if(!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if(!options.structEmitOptions) options.structEmitOptions = {};
		if(!options.classEmitOptions) options.classEmitOptions = {};

		if (!options.filter) {
			options.filter = (namespace) => true;
		}

		options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
		options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
		options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
		options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);

		return options;
	}

	prepareClassEmitOptionDefaults(options: ClassEmitOptions) {
		if(!options.enumEmitOptions) options.enumEmitOptions = {};
		if(!options.fieldEmitOptions) options.fieldEmitOptions = {};
		if(!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if(!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if(!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if(!options.methodEmitOptions) options.methodEmitOptions = {};
		if(!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if(!options.structEmitOptions) options.structEmitOptions = {};

		if(!options.filter)
			options.filter = (classObject) => classObject.isPublic;

		if (!options.perClassEmitOptions)
			options.perClassEmitOptions = () => <Object>{};

		options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);
		options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
		options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
		options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);

		return options;
	}

	prepareFileEmitOptionDefaults(options: FileEmitOptions) {
		if (!options.classEmitOptions) options.classEmitOptions = {};
		if (!options.enumEmitOptions) options.enumEmitOptions = {};
		if (!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if (!options.namespaceEmitOptions) options.namespaceEmitOptions = {};
		if (!options.structEmitOptions) options.structEmitOptions = {};
		if (!options.typeEmitOptions) options.typeEmitOptions = {};
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if (!options.fieldEmitOptions) options.fieldEmitOptions = {};

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
	}
}