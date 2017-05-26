var fs = require('fs');

import { FileEmitter } from '../src/FileEmitter';

function runCase(caseName: string) {
    it("should be able to handle case " + caseName, function (done) {
        var caseName1 = caseName;
        fs.readFile('./spec/cases/' + caseName1 + '.case.cs', 'utf8', function (err, caseInput) {
            fs.readFile('./spec/cases/' + caseName1 + '.expected.ts', 'utf8', function (err, caseExpected) {
                caseExpected = caseExpected
					.replace(/\r/g, '')
					.replace(/    /g, '\t')
					.replace(/\t/g, '  ')
                    .trim();

                var emitter = new FileEmitter(caseInput);
                var result = emitter.emitFile();

                result = result
					.replace(/\r/g, '')
					.replace(/    /g, '\t')
					.replace(/\t/g, '  ')
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
