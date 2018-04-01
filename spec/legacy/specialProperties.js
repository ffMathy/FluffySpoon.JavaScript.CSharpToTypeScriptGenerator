
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public virtual IEnumerable<MyOtherPoco> OtherPocos { get; set; }\n\
        public IEnumerable<MyOtherPoco> NonVirtualPocos { get; set; }\n\
    }\n\
\n\
    public class MyOtherPoco\n\
    {\n\
        public int id { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    OtherPocos: Array<MyOtherPoco>;\n\
    NonVirtualPocos: Array<MyOtherPoco>;\n\
}\n\
\n\
declare interface MyOtherPoco {\n\
    id: number;\n\
}";

var expectedWithoutVirtuals = "declare interface MyPoco {\n\
    NonVirtualPocos: Array<MyOtherPoco>;\n\
}\n\
\n\
declare interface MyOtherPoco {\n\
    id: number;\n\
}";
var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should include properties marked as virtual', function() {
        var result = LegacyAdapter(sampleFile);
            
        expect(result).toEqual(expectedOutput);
	});                                                                                                                                                                              

	it('should not include properties marked as virtual if option is set', function() {
        var r = LegacyAdapter(sampleFile, { ignoreVirtual: true, debug: true });
            
        expect(r).toEqual(expectedWithoutVirtuals);
	});
});

