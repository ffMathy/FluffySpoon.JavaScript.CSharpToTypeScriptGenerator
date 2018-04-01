
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int SomeInt { get; set; }\n\
    }\n\
    \n\
    public enum MyEnum\n\
    {\n\
        One, Two\n\
    }\n\
}\n";

var expectedOutput = "declare namespace MyNamespace {\n\
    enum MyEnum {\n\
        One,\n\
        Two = 1\n\
    }\n\
    interface MyPoco {\n\
        SomeInt: number;\n\
    }\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should not use declare if there is no definition file', function() {
		var result = LegacyAdapter(sampleFile, { baseNamespace: 'MyNamespace', definitionFile: false });

        expect(result).toEqual(expectedOutput);
	});
});
