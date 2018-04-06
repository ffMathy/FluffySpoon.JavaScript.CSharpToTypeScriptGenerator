
// Disable multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public enum MyEnum\n\
    {\n\
        Unknown = -1,\n\
        Green = 0,\n\
		Red = 1,\n\
		Blue = 2\n\
    }\n\
}\n";

var expectedOutput = "declare enum MyEnum {\n\
    Unknown = -1,\n\
    Green,\n\
    Red = 1,\n\
    Blue = 2\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform an enum with negative indexes correctly', function() {
		var result = LegacyAdapter(sampleFile);

        expect(result).toEqual(expectedOutput);
	});
});
