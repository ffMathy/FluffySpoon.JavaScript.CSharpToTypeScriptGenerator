import { FileEmitter, FileEmitOptions } from '../../../src/FileEmitter';
import { PerFieldEmitOptions } from '../../../src/FieldEmitter';
import { PerPropertyEmitOptions } from '../../../src/PropertyEmitter';
import { PerClassEmitOptions } from '../../../src/ClassEmitter';
import { PerInterfaceEmitOptions } from '../../../src/InterfaceEmitter';
import { PerMethodEmitOptions } from '../../../src/MethodEmitter';
import { TypeEmitOptions } from '../../../src/TypeEmitter';

import {
	CSharpClass,
	CSharpInterface,
	CSharpNamespace
} from 'fluffy-spoon.javascript.csharp-parser';

Error.stackTraceLimit = 100;

function LegacyAdapter(contents: any, options: any) {
	var emitter = new FileEmitter(contents);
	var emitOptions = <FileEmitOptions>{
		namespaceEmitOptions: {
			skip: true
		},
		classEmitOptions: {
			propertyEmitOptions: {
				typeEmitOptions: {},
				perPropertyEmitOptions: (property) => <PerPropertyEmitOptions>{
					name: property.name
				}
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
		},
		interfaceEmitOptions: {
			methodEmitOptions: {
				argumentTypeEmitOptions: {},
				returnTypeEmitOptions: {}
			},
			propertyEmitOptions: {
				typeEmitOptions: {}
			}
		},
		structEmitOptions: {
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

		let perInterfaceOrClassOptions = (input: CSharpClass | CSharpInterface) => <PerInterfaceEmitOptions | PerClassEmitOptions>{
			name: input.name,
			inheritedTypeEmitOptions: {
				mapper: (type, suggestedOutput) => suggestedOutput
			}
		};
		if (options.interfaceNameResolver) {
			perInterfaceOrClassOptions = (interfaceObject) => <PerInterfaceEmitOptions | PerClassEmitOptions>{
				name: options.interfaceNameResolver(interfaceObject.name),
				inheritedTypeEmitOptions: {
					mapper: (type, suggestedOutput) => options.interfaceNameResolver(suggestedOutput)
				}
			};

			emitOptions.interfaceEmitOptions.perInterfaceEmitOptions =
				emitOptions.classEmitOptions.perClassEmitOptions = <any>perInterfaceOrClassOptions;
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
				emitOptions.interfaceEmitOptions.perInterfaceEmitOptions = <any>perInterfaceOrClassOptions;
		}

		if (options.ignoreVirtual) {
			emitOptions.classEmitOptions.methodEmitOptions.filter = (method) => !method.isVirtual;
			emitOptions.classEmitOptions.propertyEmitOptions.filter = (property) => !property.isVirtual;
		}

		if (options.ignoreMethods) {
			emitOptions.classEmitOptions.methodEmitOptions.filter = (method) => false;
		}

		if (options.stripReadOnly) {
			emitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions = () => <PerFieldEmitOptions>{
				readOnly: false
			};
		}

		if (options.ignoreInheritance) {
			emitOptions.interfaceEmitOptions.filter = (classObject) => options.ignoreInheritance.indexOf(classObject.name) === -1;
			emitOptions.classEmitOptions.filter = (classObject) => options.ignoreInheritance.indexOf(classObject.name) === -1;
			emitOptions.classEmitOptions.perClassEmitOptions = (classObject) => <PerClassEmitOptions>{
				inheritedTypeEmitOptions: {
					filter: (type) => options.ignoreInheritance.indexOf(type.name) === -1
				}
			};
		}

		if (options.baseNamespace) {
			emitOptions.namespaceEmitOptions.skip = false;

			emitOptions.afterParsing = (file) => {
				if (file.namespaces.filter(n => n.name === options.baseNamespace)[0])
					return;

				var namespace = new CSharpNamespace(options.baseNamespace);
				namespace.classes = file.classes;
				namespace.enums = file.enums;
				namespace.innerScopeText = file.innerScopeText;
				namespace.interfaces = file.interfaces;
				namespace.namespaces = file.namespaces;
				namespace.parent = file;
				namespace.structs = file.structs;
				namespace.usings = file.usings;

				file.classes = [];
				file.enums = [];
				file.interfaces = [];
				file.namespaces = [];
				file.structs = [];
				file.usings = [];

				file.namespaces.push(namespace);
			};
		}

		if (options.dateTimeToDate) {
			emitOptions.typeEmitOptions = <TypeEmitOptions>{
				mapper: (type, suggested) => type.name === "DateTime" ? "Date" : suggested
			};
		}

		if (options.customTypeTranslations) {
			emitOptions.typeEmitOptions = <TypeEmitOptions>{
				mapper: (type, suggested) => options.customTypeTranslations[type.name] || suggested
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

export = LegacyAdapter;