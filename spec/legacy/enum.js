
// Disable multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public enum MyEnum\n\
    {\n\
        Green,\n\
		Red,\n\
		Blue,\n\
        //Purple\n\
        /* public string IgnoreMe3 {get; set; } */\n\
        /*\n\
        public string IgnoreMe4 {get; set; }\n\
        */\n\
        [SomeAttribute(64)]\n\
        Pink = 10, Ultraviolet,\n\
        Foo=1337\n\
    }\n\
}\n";

var expectedOutput = "declare enum MyEnum {\n\
    Green,\n\
    Red = 1,\n\
    Blue = 2,\n\
    Pink = 10,\n\
    Ultraviolet = 11,\n\
    Foo = 1337\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform an enum correctly', function() {
		var result = LegacyAdapter(sampleFile);

        expect(result).toEqual(expectedOutput);
	});
});
