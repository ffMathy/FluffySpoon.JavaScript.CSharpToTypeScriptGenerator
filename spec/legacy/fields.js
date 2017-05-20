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
    public string Field;\n\
    public string InterestingWhitespace ;\n\
  }\n\
}\n";

var expectedOutput = "interface MyPoco {\n\
    Field: string;\n\
    InterestingWhitespace: string;\n\
}\n";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should ignore initial newline', function() {
		var result = pocoGen(sampleFile);
    expect(result).toEqual(expectedOutput);
	});
});
