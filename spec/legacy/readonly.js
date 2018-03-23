
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

var expectedOutput = "declare interface MyPoco {\n\
    readonly Field: string;\n\
    readonly InterestingWhitespace: string;\n\
}";

var expectedOutputWithoutReadOnly = "declare interface MyPoco {\n\
    Field: string;\n\
    InterestingWhitespace: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform readonly properties correctly', function() {
        var result = LegacyAdapter(sampleFile);

        expect(result).toEqual(expectedOutput);
	});

	it('should not include readonly keywords if option is set', function() {
        var result = LegacyAdapter(sampleFile, { stripReadOnly: true });

        expect(result).toEqual(expectedOutputWithoutReadOnly);
	});
});
