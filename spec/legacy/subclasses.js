// Disable multiline warning, we're fine with ES5
// jshint -W043

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
    it('should transform subclasses correctly', function() {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MainClass\n\
    {\n\
        public void Foo() { }\n\
        \n\
        public class SubClass {\n\
            public void Bar() { }\n\
        }\n\
    }\n\
}\n";

        var expectedOutput = "interface MainClass {\n\
    Foo();\n\
}\n";

		var result = pocoGen(sampleFile);

        expect(result).toEqual(expectedOutput);
    });
});
