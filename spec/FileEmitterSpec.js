"use strict";
var fs = require('fs');
var FileEmitter_1 = require("../src/FileEmitter");
function runCase(caseName, options) {
    it("should be able to handle case " + caseName, function (done) {
        var localCaseName = caseName;
        var localOptions = options;
        fs.readFile('./spec/cases/' + localCaseName + '.case.cs', 'utf8', function (err, caseInput) {
            fs.readFile('./spec/cases/' + localCaseName + '.expected.ts', 'utf8', function (err, caseExpected) {
                caseExpected = caseExpected
                    .replace(/\r/g, '')
                    .replace(/    /g, '\t')
                    .replace(/\t/g, '  ')
                    .trim();
                var emitter = new FileEmitter_1.FileEmitter(caseInput);
                emitter.logger.setLogMethod(function (message) {
                    var parameters = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        parameters[_i - 1] = arguments[_i];
                    }
                    if (parameters.length > 0) {
                        console.log(emitter.stringEmitter.currentIndentation + message, parameters);
                    }
                    else {
                        console.log(emitter.stringEmitter.currentIndentation + message);
                    }
                });
                var result = emitter.emitFile(localOptions);
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
