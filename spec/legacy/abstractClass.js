var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public abstract class MyPoco\n\
    {\n\
        public string Name { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    Name: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform an abstract class correctly', function() {
		var result = LegacyAdapter(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
});
