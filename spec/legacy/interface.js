/// <reference path="../typings/tsd.d.ts" />
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public interface MyInterface\n\
    {\n\
        string Foo(string bar);\n\
        \
        string Name { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "interface MyInterface {\n\
    Name: string;\n\n\
    Foo(bar: string): string;\n\
}";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform an interface correctly', function() {
		var result = pocoGen(sampleFile, { includeInterfaces: true });
        
        expect(result).toEqual(expectedOutput);
	});
});
