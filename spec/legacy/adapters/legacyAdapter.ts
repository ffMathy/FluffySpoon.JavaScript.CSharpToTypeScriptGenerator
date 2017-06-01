import { FileEmitter, FileEmitOptions } from '../../../src/FileEmitter';
import { PerFieldEmitOptions } from '../../../src/FieldEmitter';
import { PerClassEmitOptions } from '../../../src/ClassEmitter';

function pocoGen(contents, options) {
	var emitter = new FileEmitter(contents);
	var emitOptions = <FileEmitOptions>{
		namespaceEmitOptions: {
			skip: true
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
		}
	};

	if (options) {
		if (options.useStringUnionTypes) {
			emitOptions.enumEmitOptions.strategy = "string-union";
		}

		if (options.propertyNameResolver) {
			emitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions = (property) => <PerFieldEmitOptions>{
				name: options.propertyNameResolver(property.name)
			};
		}

		if (options.prefixWithI) {
			emitOptions.classEmitOptions.perClassEmitOptions = (classObject) => <PerClassEmitOptions>{
				name: "I" + classObject.name,
				inheritedTypeEmitOptions: {
					mapper: (type, suggested) => "I" + suggested
				}
			};
		}

		if (options.ignoreVirtual) {
			emitOptions.classEmitOptions.methodEmitOptions.filter = (method) => !method.isVirtual;
			emitOptions.classEmitOptions.propertyEmitOptions.filter = (property) => !property.isVirtual;
		}

		if (options.stripReadOnly) {
			emitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions = () => <PerFieldEmitOptions>{
				readOnly: false
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