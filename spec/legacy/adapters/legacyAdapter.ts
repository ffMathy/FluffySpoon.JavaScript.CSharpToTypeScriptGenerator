import { FileEmitter, FileEmitOptions } from '../../../src/FileEmitter';
import { PerFieldEmitOptions } from '../../../src/FieldEmitter';
import { PerPropertyEmitOptions } from '../../../src/PropertyEmitter';
import { PerClassEmitOptions } from '../../../src/ClassEmitter';
import { PerInterfaceEmitOptions } from '../../../src/InterfaceEmitter';
import { PerMethodEmitOptions } from '../../../src/MethodEmitter';

import {
	CSharpClass,
	CSharpInterface
} from 'fluffy-spoon.javascript.csharp-parser';

declare type InterfaceNameDecorationFunction = (input: CSharpClass|CSharpInterface) => PerClassEmitOptions|PerInterfaceEmitOptions;

function pocoGen(contents, options) {
	var emitter = new FileEmitter(contents);
	var emitOptions = <FileEmitOptions>{
		namespaceEmitOptions: {
			skip: true,
			structEmitOptions: {
				declare: false
			},
			interfaceEmitOptions: {
				declare: false
			}
		},
		classEmitOptions: {
			declare: false,
			propertyEmitOptions: {
				typeEmitOptions: {}
			},
			methodEmitOptions: {
				argumentTypeEmitOptions: {},
				returnTypeEmitOptions: {}
			},
			fieldEmitOptions: {
				perFieldEmitOptions: (field) => <PerFieldEmitOptions>{
					readOnly: field.isReadOnly
				}
            }
		},
		enumEmitOptions: {
			declare: true
        },
		interfaceEmitOptions: {
			declare: false,
			methodEmitOptions: {
				argumentTypeEmitOptions: {},
				returnTypeEmitOptions: {}
			},
			propertyEmitOptions: {
				typeEmitOptions: {}
			}
		},
        structEmitOptions: {
            declare: false
        }
	};

	emitter.logger.setLogMethod((message, ...parameters) => {
		if (parameters.length > 0) {
			console.log(
				emitter.stringEmitter.currentIndentation + message,
				parameters);
		} else {
			console.log(
				emitter.stringEmitter.currentIndentation + message);
		}
	});

	if (options) {
		if (options.useStringUnionTypes) {
			emitOptions.enumEmitOptions.strategy = "string-union";
		}

		if (options.propertyNameResolver) {
			emitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions = 
			emitOptions.interfaceEmitOptions.propertyEmitOptions.perPropertyEmitOptions = (property) => <PerPropertyEmitOptions>{
				name: options.propertyNameResolver(property.name)
			};
		}

		if (options.methodNameResolver) {
			emitOptions.interfaceEmitOptions.methodEmitOptions.perMethodEmitOptions = 
			emitOptions.classEmitOptions.methodEmitOptions.perMethodEmitOptions = (method) => <PerMethodEmitOptions>{
				name: options.methodNameResolver(method.name)
			};
		}

		let perInterfaceOrClassOptions = (input: CSharpClass|CSharpInterface) => <PerInterfaceEmitOptions|PerClassEmitOptions>{
				name: input.name,
				inheritedTypeEmitOptions: {
					mapper: (type, suggestedOutput) => suggestedOutput
				}
			};
		if (options.interfaceNameResolver) {
			perInterfaceOrClassOptions = (interfaceObject) => <PerInterfaceEmitOptions|PerClassEmitOptions>{
				name: options.interfaceNameResolver(interfaceObject.name),
				inheritedTypeEmitOptions: {
					mapper: (type, suggestedOutput) => options.interfaceNameResolver(suggestedOutput)
				}
			};

			emitOptions.interfaceEmitOptions.perInterfaceEmitOptions = 
			emitOptions.classEmitOptions.perClassEmitOptions = perInterfaceOrClassOptions;
		}

		if (options.prefixWithI) {
			var prefixWithIPerInterfaceOrClassOptions = perInterfaceOrClassOptions;
			perInterfaceOrClassOptions = (classObject) => <PerClassEmitOptions>{
				name: "I" + prefixWithIPerInterfaceOrClassOptions(classObject).name,
				inheritedTypeEmitOptions: {
					mapper: (type, suggested) => 
						"I" + prefixWithIPerInterfaceOrClassOptions(classObject).inheritedTypeEmitOptions.mapper(type, suggested)
				}
			};

			emitOptions.classEmitOptions.perClassEmitOptions = 
			emitOptions.interfaceEmitOptions.perInterfaceEmitOptions = perInterfaceOrClassOptions;
		}

		if (options.ignoreVirtual) {
			emitOptions.classEmitOptions.methodEmitOptions.filter = (method) => !method.isVirtual;
			emitOptions.classEmitOptions.propertyEmitOptions.filter = (property) => !property.isVirtual;
		}

		if(options.ignoreMethods) {
			emitOptions.classEmitOptions.methodEmitOptions.filter = (method) => false;
		}

		if (options.stripReadOnly) {
			emitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions = () => <PerFieldEmitOptions>{
				readOnly: false
			};
		}

		if(options.ignoreInheritance) {
			emitOptions.interfaceEmitOptions.filter = (classObject) => options.ignoreInheritance.indexOf(classObject.name) === -1;
			emitOptions.classEmitOptions.filter = (classObject) => options.ignoreInheritance.indexOf(classObject.name) === -1;
			emitOptions.classEmitOptions.perClassEmitOptions = (classObject) => <PerClassEmitOptions>{
				inheritedTypeEmitOptions: {
					filter: (type) => options.ignoreInheritance.indexOf(type.name) === -1
				}
			};
		}

		if (options.typeResolver) {
			emitOptions.classEmitOptions
				.propertyEmitOptions
				.typeEmitOptions
				.mapper = (type, suggested) => options.typeResolver(
					suggested,
					"property-type");

			emitOptions.classEmitOptions
				.methodEmitOptions
				.returnTypeEmitOptions
				.mapper = (type, suggested) => options.typeResolver(
					suggested,
					"method-return-type");

			emitOptions.classEmitOptions
				.methodEmitOptions
				.argumentTypeEmitOptions
				.mapper = (type, suggested) => options.typeResolver(
					suggested,
					"method-argument-type");
		}
	}

	return emitter.emitFile(emitOptions);
}

export = pocoGen;