var fs = require('fs');

import { FileEmitter, FileEmitOptions } from '../src/FileEmitter';
import { Logger } from '../src/Logger';

function runCase(caseName: string, options?: FileEmitOptions) {
	it("should be able to handle case " + caseName, function (done) {
		let localCaseName = caseName;
		let localOptions = options;
		fs.readFile('./spec/cases/' + localCaseName + '.case.cs', 'utf8', function (err: any, caseInput: any) {
			let tsFileToUse = './spec/cases/' + localCaseName + '.expected.ts';
			let dtsFileToUse = './spec/cases/' + localCaseName + '.expected.d.ts';

			let fileToUse = fs.existsSync(tsFileToUse) ? tsFileToUse : dtsFileToUse;
			console.log("Comparing result with", fileToUse);

			fs.readFile(fileToUse, 'utf8', function (err: any, caseExpected: any) {
				caseExpected = caseExpected
					.replace(/\r/g, '')
					.replace(/    /g, '\t')
					.replace(/\t/g, '  ')
					.replace(/\n/g, '\\n\n')
					.trim();

				let emitter = new FileEmitter(caseInput);
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
                
				let result = emitter.emitFile(localOptions);
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
