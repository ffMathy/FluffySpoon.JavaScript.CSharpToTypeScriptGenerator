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

import { fileEmitOptionsInheritanceTree } from './FileEmitOptionsInheritanceTree';

//for this to work, we need our option objects to be classes, not interfaces.
export interface OptionsInheritanceTreeNode<T> {
	propertyName?: string;
	applyInheritance?: (parent: T, defaultValue?: T) => {
		tree?: OptionsInheritanceTreeNode<any>[] | null,
		result: T
	};
}

export class OptionsHelper {

	static mergeOptions<T extends Object, K extends Object>(
		defaultOptions: T,
		initialOptions: T,
		newOptions: K): T | K 
	{
		let me = this;

		if(typeof initialOptions === "function" && initialOptions["isDefault"] !== true) 
			return initialOptions;

		if(typeof newOptions === "function" && newOptions["isDefault"] !== true) 
			return newOptions;

		if (typeof initialOptions === "undefined") return newOptions;
		if (typeof newOptions === "undefined") return initialOptions;

		if (!Array.isArray(initialOptions) && !Array.isArray(newOptions) && 
			typeof initialOptions === "object" && typeof newOptions === "object") {

			var defaultOptionsCopy = Object.assign({}, defaultOptions);
			var initialOptionsCopy = Object.assign({}, initialOptions);
			var newOptionsCopy = Object.assign({}, newOptions);

			let usedKeys = new Array<string>();

			for (var parentKey in initialOptionsCopy)
				for (var childKey in newOptionsCopy) {

					if (!initialOptionsCopy.hasOwnProperty(parentKey)) continue;
					if (!newOptionsCopy.hasOwnProperty(childKey)) continue;

					if (parentKey.toString() !== childKey.toString()) continue;
					
					if(usedKeys.indexOf(parentKey) > -1) continue;
					usedKeys.push(parentKey);

					var initialValue = <any>initialOptionsCopy[parentKey];
					if (typeof initialValue !== "undefined" && typeof initialValue !== "object" && typeof initialValue !== "function")
						continue;

					var newValue = <any>newOptionsCopy[childKey];					
					if (typeof initialValue !== typeof newValue)
						throw new Error("Could not merge options [" + (typeof initialValue) + "] " + parentKey + " and [" + (typeof newValue) + "] " + childKey + ".");

					newValue = this.mergeOptions(
						defaultOptionsCopy[parentKey], 
						initialValue, 
						newValue);
					if(typeof newValue === "undefined")
						continue;

					initialOptionsCopy[parentKey] = initialValue;
					newOptionsCopy[childKey] = newValue;
				}

			var result = Object.assign(
				initialOptionsCopy,
				newOptionsCopy);
			return result;
		}

		if (typeof initialOptions !== "undefined" && typeof initialOptions !== "object" && typeof initialOptions !== "function")
			return initialOptions;

		return newOptions;
	}

	private static markFunctionsAsDefault(target: any) {
		for(var key in target) {
			if(!target.hasOwnProperty(key))
				continue;

			if(typeof target[key] === "function")
				target[key]["isDefault"] = true;
		}
	}

	private static applyInheritanceTree(parent: Object, tree: OptionsInheritanceTreeNode<any>[]) {
		if (!tree)
			return parent;

		var inheritancesToRun = <{ parent: Object, tree: OptionsInheritanceTreeNode<any>[] }[]>[];
		for (let inheritance of tree) {
			if (inheritance.propertyName && !parent[inheritance.propertyName])
				continue;

			var property = inheritance.propertyName ?
				parent[inheritance.propertyName] :
				parent;
			var defaultValue = Object.assign({}, property);
			var returnValue = inheritance.applyInheritance(property, defaultValue);

			if (inheritance.propertyName) {
				parent[inheritance.propertyName] = returnValue.result;
			} else {
				parent = returnValue.result;
			}

			inheritancesToRun.push({
				parent: returnValue.result,
				tree: returnValue.tree
			});
		}

		for (let inheritance of inheritancesToRun) {
			this.applyInheritanceTree(
				inheritance.parent, 
				inheritance.tree);
		}

		return parent;
	}

	static prepareFileEmitOptionInheritance(options: FileEmitOptions) {
		var inheritancesToRun = [fileEmitOptionsInheritanceTree];
		options = this.applyInheritanceTree(options, inheritancesToRun);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareEnumEmitOptionDefaults(options: EnumEmitOptions) {
		if (!options.filter)
			options.filter = (enumObject) => !!enumObject.isPublic;

		if (!options.strategy) {
			options.strategy = "default";
		}

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareTypeEmitOptionDefaults(options: TypeEmitOptions) {
		if (!options.filter) {
			options.filter = (type) => true;
		}

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareFieldEmitOptionDefaults(options: FieldEmitOptions) {
		if (!options.typeEmitOptions) options.typeEmitOptions = {};

		if (!options.filter) {
			options.filter = (field) => !!field.isPublic;
		}

		if (!options.perFieldEmitOptions) {
			options.perFieldEmitOptions = () => options;
		}

		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static preparePropertyEmitOptionDefaults(options: PropertyEmitOptions) {
		if (!options.typeEmitOptions) options.typeEmitOptions = {};

		if (!options.filter) {
			options.filter = (property) => !!property.isPublic;
		}

		if (!options.perPropertyEmitOptions) {
			options.perPropertyEmitOptions = (property) => <PerPropertyEmitOptions>{
				name: property.name.charAt(0).toLowerCase() + property.name.substring(1)
			};
		}

		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareStructEmitOptionDefaults(options: StructEmitOptions) {
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if (!options.fieldEmitOptions) options.fieldEmitOptions = {};

		if (!options.filter) {
			options.filter = (struct) => !!struct.isPublic;
		}

		if (!options.perStructEmitOptions) {
			options.perStructEmitOptions = () => options;
		}

		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareMethodEmitOptionDefaults(options: MethodEmitOptions) {
		if (!options.argumentTypeEmitOptions) options.argumentTypeEmitOptions = {};
		if (!options.returnTypeEmitOptions) options.returnTypeEmitOptions = {};

		if (!options.filter) {
			options.filter = (method) => !!method.isPublic;
		}

		if (!options.perMethodEmitOptions) {
			options.perMethodEmitOptions = () => options;
		}

		options.argumentTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.argumentTypeEmitOptions);
		options.returnTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.returnTypeEmitOptions);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareInterfaceEmitOptionDefaults(options: InterfaceEmitOptions) {
		if (!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if (!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};

		if (!options.filter) {
			options.filter = (interfaceObject) => !!interfaceObject.isPublic;
		}

		if (!options.perInterfaceEmitOptions) {
			options.perInterfaceEmitOptions = () => options;
		}

		options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
		options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareNamespaceEmitOptionDefaults(options: NamespaceEmitOptions) {
		if (!options.enumEmitOptions) options.enumEmitOptions = {};
		if (!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if (!options.structEmitOptions) options.structEmitOptions = {};
		if (!options.classEmitOptions) options.classEmitOptions = {};

		if (!options.filter) {
			options.filter = (namespace) => true;
		}

		options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
		options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
		options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
		options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareClassEmitOptionDefaults(options: ClassEmitOptions) {
		if (!options.enumEmitOptions) options.enumEmitOptions = {};
		if (!options.fieldEmitOptions) options.fieldEmitOptions = {};
		if (!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if (!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if (!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if (!options.structEmitOptions) options.structEmitOptions = {};

		if (!options.filter)
			options.filter = (classObject) => !!classObject.isPublic;

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

		this.markFunctionsAsDefault(options);
		return options;
	}

	static prepareFileEmitOptionDefaults(options: FileEmitOptions) {
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

		this.markFunctionsAsDefault(options);
		return options;
	}
}