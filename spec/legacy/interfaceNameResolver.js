
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
        public string Title { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "declare interface myPoco {\n\
    Id: number;\n\
    NameOfStuff: string;\n\
    Title: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function () {
    it('should use the interfaceNameResolver option correctly', function () {
        var result = LegacyAdapter(sampleFile, { interfaceNameResolver: camelCaseResolver });

        expect(result).toEqual(expectedOutput);

        function camelCaseResolver(interfaceName) {
            return interfaceName[0].toLowerCase() + interfaceName.substring(1);
        }
    });
});
