"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var FileEmitter_1 = require("../src/FileEmitter");
Error.stackTraceLimit = 100;
function runCase(caseName, options) {
    it("should be able to handle case " + caseName, function (done) {
        var localCaseName = caseName;
        var localOptions = options;
        fs.readFile('./spec/cases/' + localCaseName + '.case.cs', 'utf8', function (err, caseInput) {
            var tsFileToUse = './spec/cases/' + localCaseName + '.expected.ts';
            var dtsFileToUse = './spec/cases/' + localCaseName + '.expected.d.ts';
            var fileToUse = fs.existsSync(tsFileToUse) ? tsFileToUse : dtsFileToUse;
            console.log("Comparing result with", fileToUse);
            fs.readFile(fileToUse, 'utf8', function (err, caseExpected) {
                caseExpected = caseExpected
                    .replace(/\r/g, '')
                    .replace(/    /g, '\t')
                    .replace(/\t/g, '  ')
                    .replace(/\n/g, '\\n\n')
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
//# sourceMappingURL=FileEmitterSpec.js.map