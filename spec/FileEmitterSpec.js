"use strict";
var fs = require('fs');
var FileEmitter_1 = require("../src/FileEmitter");
function runCase(caseName) {
    it("should be able to handle case " + caseName, function (done) {
        fs.readFile('./spec/cases/' + caseName + '.case.cs', 'utf8', function (err, caseInput) {
            fs.readFile('./spec/cases/' + caseName + '.expected.ts', 'utf8', function (err, caseExpected) {
                var emitter = new FileEmitter_1.FileEmitter(caseInput);
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
