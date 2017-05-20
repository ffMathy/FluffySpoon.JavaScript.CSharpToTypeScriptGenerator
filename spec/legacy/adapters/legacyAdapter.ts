import { FileEmitter } from '../../../src/FileEmitter';

function pocoGen(contents, options) {
	var emitter = new FileEmitter(contents);
	return emitter.emitFile();
}

export = pocoGen;