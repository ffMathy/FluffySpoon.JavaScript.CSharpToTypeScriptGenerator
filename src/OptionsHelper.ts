import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitOptions } from './StructEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { FileEmitOptions } from './FileEmitter';

//for this to work, we need our option objects to be classes, not interfaces.
export interface OptionsInheritanceTreeNode<T> {
    typeName: string; //MyClass.name should work here
    applyInheritance?: (parent: T) => T;
    inheritanceTree: OptionsInheritanceTreeNode<any>[];
}

export class OptionsHelper {
    prepareFileEmitOptionInheritance(options: FileEmitOptions) {
        var tree = <OptionsInheritanceTreeNode<FileEmitOptions>>{
            typeName: options.constructor.name,
            applyInheritance: (fileEmitOptions) => {
                
            },
            inheritanceTree: [
                {
                    typeName: options.classEmitOptions.constructor.name,
                    applyInheritance: (classEmitOptions) => {

                    },
                    inheritanceTree: [

                    ]
                }
            ]
        };
    }

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
	
	prepareEnumEmitOptionDefaults(options: EnumEmitOptions) {
		return options;
	}
	
	prepareTypeEmitOptionDefaults(options: TypeEmitOptions) {
		return options;
	}
	
	prepareFieldEmitOptionDefaults(options: FieldEmitOptions) {
		if(!options.typeEmitOptions) options.typeEmitOptions = {};
		
		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		return options;
	}
	
	preparePropertyEmitOptionDefaults(options: PropertyEmitOptions) {
		if(!options.typeEmitOptions) options.typeEmitOptions = {};
		
		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		return options;
	}
	
	prepareStructEmitOptionDefaults(options: StructEmitOptions) {
		if(!options.methodEmitOptions) options.methodEmitOptions = {};
		if(!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if(!options.fieldEmitOptions) options.fieldEmitOptions = {};
		
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);

		return options;
	}
	
	prepareMethodEmitOptionDefaults(options: MethodEmitOptions) {
		if(!options.argumentTypeEmitOptions) options.argumentTypeEmitOptions = {};
		if(!options.returnTypeEmitOptions) options.returnTypeEmitOptions = {};
		
		options.argumentTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.argumentTypeEmitOptions);
		options.returnTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.returnTypeEmitOptions);

		return options;
	}
	
	prepareInterfaceEmitOptionDefaults(options: InterfaceEmitOptions) {
		if(!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if(!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if(!options.methodEmitOptions) options.methodEmitOptions = {};
		if(!options.propertyEmitOptions) options.propertyEmitOptions = {};

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