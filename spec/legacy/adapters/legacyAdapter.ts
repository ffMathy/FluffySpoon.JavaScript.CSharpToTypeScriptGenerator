import { FileEmitter, FileEmitOptions } from '../../../src/FileEmitter';

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

		if (options.ignoreVirtual) {
			emitOptions.classEmitOptions.methodEmitOptions.filter = (method) => !method.isVirtual;
			emitOptions.classEmitOptions.propertyEmitOptions.filter = (property) => !property.isVirtual;
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