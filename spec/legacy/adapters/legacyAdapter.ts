import { FileEmitter } from '../../../src/FileEmitter';

function pocoGen(contents, options) {
	var emitter = new FileEmitter(contents);
	return emitter.emitFile({
		namespaceEmitOptions: {
			skip: true
		},
		classEmitOptions: {
			declare: false
		}
	});
}

export = pocoGen;