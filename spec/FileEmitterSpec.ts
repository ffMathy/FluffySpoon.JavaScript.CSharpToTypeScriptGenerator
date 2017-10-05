var fs = require('fs');

import { FileEmitter, FileEmitOptions } from '../src/FileEmitter';
import { Logger } from '../src/Logger';

function runCase(caseName: string, options?: FileEmitOptions) {
	it("should be able to handle case " + caseName, function (done) {
		var localCaseName = caseName;
		var localOptions = options;
		fs.readFile('./spec/cases/' + localCaseName + '.case.cs', 'utf8', function (err, caseInput) {
			fs.readFile('./spec/cases/' + localCaseName + '.expected.ts', 'utf8', function (err, caseExpected) {
				caseExpected = caseExpected
					.replace(/\r/g, '')
					.replace(/    /g, '\t')
					.replace(/\t/g, '  ')
					.replace(/\n/g, '\\n\n')
					.trim();

				var emitter = new FileEmitter(caseInput);
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
                
				var result = emitter.emitFile(localOptions);
				result = result
					.replace(/\r/g, '')
					.replace(/    /g, '\t')
					.replace(/\t/g, '  ')
					.replace(/\n/g, '\\n\n')
					.trim();
				expect(result).toBe(caseExpected);

				done();
			});
		});
	});
}

describe("UseCases", function () {

	runCase("Enum");
	runCase("Property");
	runCase("Class");

});
