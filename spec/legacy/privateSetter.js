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
    public string PrivateSetter { get; private set; }\n\
    public string InterestingWhitespace\n\
    {\n\
      get;\n\
      private    set;\n\
    }\n\
  }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    PrivateSetter: string;\n\
    InterestingWhitespace: string;\n\
}";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should ignore initial newline', function() {
		var result = pocoGen(sampleFile);
    expect(result).toEqual(expectedOutput);
	});
});
