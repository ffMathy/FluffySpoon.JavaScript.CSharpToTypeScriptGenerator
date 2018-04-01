
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

var expectedOutput = "declare interface MyInterface {\n\
    Name: string;\n\
    Foo(bar: string): string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform an interface correctly', function() {
		var result = LegacyAdapter(sampleFile, { includeInterfaces: true });
        
        expect(result).toEqual(expectedOutput);
	});
});
