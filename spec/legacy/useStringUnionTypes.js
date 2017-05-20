/// <reference path="../typings/tsd.d.ts" />
// Disable multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public enum MyEnum\n\
    {\n\
        Unknown = -1\n\
        Green = 0,\n\
		Red = 1,\n\
		Blue = 2\n\
    }\n\
}\n";

var expectedOutput = "declare type MyEnum =\n\
    'Unknown' |\n\
    'Green' |\n\
    'Red' |\n\
    'Blue'\n\
";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform an enum to a string union type correctly', function() {
		var result = pocoGen(sampleFile, { useStringUnionTypes: true });

        expect(result).toEqual(expectedOutput);
	});
});
