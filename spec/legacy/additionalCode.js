/// <reference path="../typings/tsd.d.ts" />
// Disable multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int Foo { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "interface MyPoco {\n\
    Foo: number;\n\n\
    customStuff: MyPocoBlah;\n\
    foo(blah: number): OtherStuff;\n\
}\n";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform additional code correctly', function() {
		var result = pocoGen(
            sampleFile,
            {
                additionalInterfaceCodeResolver: (leadingWhitespace, className) => "customStuff: " + className + "Blah;\n\
    foo(blah: number): OtherStuff;"
            }
        );

        expect(result).toEqual(expectedOutput);
	});
});
