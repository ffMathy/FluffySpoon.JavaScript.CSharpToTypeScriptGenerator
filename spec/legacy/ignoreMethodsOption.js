
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int Id { get; set; }\n\
        public string NameOfStuff { get; set; }\n\
        public string Foo() { }\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    Id: number;\n\
    NameOfStuff: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function () {
    it('should ignore methods', function () {
        var result = LegacyAdapter(sampleFile, { ignoreMethods: true });

        expect(result).toEqual(expectedOutput);
    });
});
