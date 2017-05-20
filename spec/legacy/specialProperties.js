/// <reference path="../typings/tsd.d.ts" />
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

var expectedOutput = "interface MyPoco {\n\
    OtherPocos: MyOtherPoco[];\n\
    NonVirtualPocos: MyOtherPoco[];\n\
}\n\
\n\
interface MyOtherPoco {\n\
    id: number;\n\
}\n";

var expectedWithoutVirtuals = "interface MyPoco {\n\
    NonVirtualPocos: MyOtherPoco[];\n\
}\n\
\n\
interface MyOtherPoco {\n\
    id: number;\n\
}\n";
var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should include properties marked as virtual', function() {
        var result = pocoGen(sampleFile);
            
        expect(result).toEqual(expectedOutput);
	});

	it('should not include properties marked as virtual if option is set', function() {
        var r = pocoGen(sampleFile, { ignoreVirtual: true, debug: true });
            
        expect(r).toEqual(expectedWithoutVirtuals);
	});
});

