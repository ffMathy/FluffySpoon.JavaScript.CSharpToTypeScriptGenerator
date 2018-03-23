
// Disables multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
\n\
    public enum JustAnEnum\n\
    {\n\
      One, Two\n\
    }\n\
}\n";

var expectedOutput = "declare enum JustAnEnum {\n\
    One,\n\
    Two = 1\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should ignore initial newline', function() {
		var result = LegacyAdapter(sampleFile);
    expect(result).toEqual(expectedOutput);
	});
});
