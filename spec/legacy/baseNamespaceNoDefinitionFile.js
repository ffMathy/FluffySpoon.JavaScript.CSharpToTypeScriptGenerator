/// <reference path="../typings/tsd.d.ts" />
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
        One = 0,\n\
        Two = 1\n\
    }\n\n\
    interface MyPoco {\n\
        SomeInt: number;\n\
    }\n\
}";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should not use declare if there is no definition file', function() {
		var result = pocoGen(sampleFile, { baseNamespace: 'MyNamespace', definitionFile: false });

        expect(result).toEqual(expectedOutput);
	});
});
