import { FileEmitter, FileEmitOptions } from '../../../src/FileEmitter';

function pocoGen(contents, options) {
	var emitter = new FileEmitter(contents);
	var emitOptions = <FileEmitOptions>{
		namespaceEmitOptions: {
			skip: true
		},
		classEmitOptions: {
			declare: false
		},
		enumEmitOptions: {
			declare: true
		}
	};

	if (options) {
		if (options.useStringUnionTypes) {
			emitOptions.enumEmitOptions.strategy = "string-union";
		}
	}

	return emitter.emitFile(emitOptions);
}

export = pocoGen;