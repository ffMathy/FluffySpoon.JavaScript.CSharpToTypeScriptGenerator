
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
    readonly PrivateSetter: string;\n\
    readonly InterestingWhitespace: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should ignore initial newline', function() {
		var result = LegacyAdapter(sampleFile);
    expect(result).toEqual(expectedOutput);
	});
});
