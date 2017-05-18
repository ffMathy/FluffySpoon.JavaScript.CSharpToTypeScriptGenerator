var fs = require('fs');

import { FileEmitter } from '../src/FileEmitter';

function runCase(caseName: string) {
    it("should be able to handle case " + caseName, function (done) {
        fs.readFile('./spec/cases/' + caseName + '.case.cs', 'utf8', function (err, caseInput) {
            fs.readFile('./spec/cases/' + caseName + '.expected.ts', 'utf8', function (err, caseExpected) {
                caseExpected = caseExpected.replace(/\r/g, '');

                var emitter = new FileEmitter(caseInput);
                var result = emitter.emitFile();

                expect(result).toBe(caseExpected);

                done();
            });
        });
    });
}

describe("UseCases", function () {

    runCase("Enum");

});
