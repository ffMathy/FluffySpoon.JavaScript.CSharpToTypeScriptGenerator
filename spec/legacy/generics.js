
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform a POCO with a single generic type correctly', function() {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco<T>\n\
    {\n\
        public T GenericTypeValue {get;set;}\n\
    }\n\
}\n";

        var expectedOutput = "declare interface MyPoco<T> {\n\
    GenericTypeValue: T;\n\
}";

		var result = LegacyAdapter(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
    
	it('should transform a POCO with multiple generic types correctly', function() {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco<T, K>\n\
    {\n\
        public T GenericTypeValue {get;set;}\n\
        public K GenericTypeValue {get;set;}\n\
    }\n\
}\n";

        var expectedOutput = "declare interface MyPoco<T, K> {\n\
    GenericTypeValue: T;\n\
    GenericTypeValue: K;\n\
}";

		var result = LegacyAdapter(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
    
	it('should transform a POCO with a multi-generic property correctly', function() {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public SomeFoo<int, string> Stuff {get;set;}\n\
    }\n\
}\n";

        var expectedOutput = "declare interface MyPoco {\n\
    Stuff: SomeFoo<number, string>;\n\
}";

		var result = LegacyAdapter(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
});
