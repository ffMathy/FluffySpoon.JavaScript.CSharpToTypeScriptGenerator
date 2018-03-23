
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int IntField { get; set; }\n\
        public string UntouchedString { get; set; }\n\
        public DateTimeOffset SomeDate { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    IntField: number;\n\
    UntouchedString: string;\n\
    SomeDate: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should handle custom translations correctly', function() {
		var result = LegacyAdapter(sampleFile, {
            customTypeTranslations: {
              DateTimeOffset: 'string'
            }
        });

        expect(result).toEqual(expectedOutput);
	});
});
