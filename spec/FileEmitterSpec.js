"use strict";
var fs = require('fs');
var FileEmitter_1 = require("../src/FileEmitter");
function runCase(caseName) {
    it("should be able to handle case " + caseName, function (done) {
        var caseName1 = caseName;
        fs.readFile('./spec/cases/' + caseName1 + '.case.cs', 'utf8', function (err, caseInput) {
            fs.readFile('./spec/cases/' + caseName1 + '.expected.ts', 'utf8', function (err, caseExpected) {
                caseExpected = caseExpected
                    .replace(/\r/g, '')
                    .trim();
                var emitter = new FileEmitter_1.FileEmitter(caseInput);
                var result = emitter.emitFile();
                result = result
                    .replace(/\r/g, '')
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
});
