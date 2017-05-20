/// <reference path="../typings/tsd.d.ts" />
// Disables multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
\n\
  public class MyPoco\n\
  {\n\
    public readonly string Field;\n\
    public readonly string InterestingWhitespace ;\n\
  }\n\
}\n";

var expectedOutput = "interface MyPoco {\n\
    readonly Field: string;\n\
    readonly InterestingWhitespace: string;\n\
}\n";

var expectedOutputWithoutReadOnly = "interface MyPoco {\n\
    Field: string;\n\
    InterestingWhitespace: string;\n\
}\n";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform readonly properties correctly', function() {
        var result = pocoGen(sampleFile);

        expect(result).toEqual(expectedOutput);
	});

	it('should not include readonly keywords if option is set', function() {
        var result = pocoGen(sampleFile, { stripReadOnly: true });

        expect(result).toEqual(expectedOutputWithoutReadOnly);
	});
});
