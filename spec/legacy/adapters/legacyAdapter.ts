import { FileEmitter, FileEmitOptions } from '../../../src/FileEmitter';
import { PerFieldEmitOptions } from '../../../src/FieldEmitter';
import { PerPropertyEmitOptions } from '../../../src/PropertyEmitter';
import { PerClassEmitOptions } from '../../../src/ClassEmitter';
import { PerMethodEmitOptions } from '../../../src/MethodEmitter';

function pocoGen(contents, options) {
	var emitter = new FileEmitter(contents);
	var emitOptions = <FileEmitOptions>{
		namespaceEmitOptions: {
			skip: true,
			structEmitOptions: {
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
			emitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions = (property) => <PerPropertyEmitOptions>{
				name: options.propertyNameResolver(property.name)
			};
		}

		if (options.methodNameResolver) {
			emitOptions.classEmitOptions.methodEmitOptions.perMethodEmitOptions = (method) => <PerMethodEmitOptions>{
				name: options.methodNameResolver(method.name)
			};
		}

		if (options.interfaceNameResolver) {
			var existing = emitOptions.classEmitOptions.perClassEmitOptions;
			emitOptions.classEmitOptions.perClassEmitOptions = (classObject) => {
				if(existing) existing(classObject);
				return <PerClassEmitOptions>{
					name: options.interfaceNameResolver(classObject.name)
				};
			};
		}

		if (options.prefixWithI) {
			var existing = emitOptions.classEmitOptions.perClassEmitOptions;
			emitOptions.classEmitOptions.perClassEmitOptions = (classObject) => {
				if(existing) existing(classObject);
				return <PerClassEmitOptions>{
					name: "I" + classObject.name,
					inheritedTypeEmitOptions: {
						mapper: (type, suggested) => "I" + suggested
					}
				};
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