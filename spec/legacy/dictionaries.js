// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public IDictionary<int, string> Stuff {get;set;}\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    Stuff: {\n\
        [key: number]: string;\n\
    };\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform a POCO with a dictionary property correctly', function() {

		var result = LegacyAdapter(sampleFile);

        expect(result).toEqual(expectedOutput);
	});
});
