

/* jshint -W043 */

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public MyPoco()\n\
        {\n\
        }\n\
\n\
        public MyPoco(RichObject value)\n\
        {\n\
            this.Id = value.Id;\n\
            this.Name = value.Name;\n\
            this.Title = value.Title;\n\
        }\n\
        public int Id { get; set; }\n\
        public string Name { get; set; }\n\
        //public string IgnoreMe { get; set; }\n\
        // public string IgnoreMe2 { get; set; }\n\
        /* public string IgnoreMe3 {get; set; } */\n\
        /*\n\
        public string IgnoreMe4 {get; set; }\n\
        */\n\
        public string Title\n\
        {\n\
            get;\n\
            set;\n\
        }\n\
        public List<string> ListFields { get; set; }\n\
        public IEnumerable<string> IEnumerableFields { get; set; }\n\
        public string[] ArrayFields { get; set; }\n\
        public bool? OptionalBool {get; set;}\n\
        public DateTime SomeDate {get;set;}\n\
        public decimal SomeDecimal {get;set;}\n\
        public Guid SomeGuid {get;set;}\n\
    }\n\
    \n\
    public partial class MyOtherPoco\n\
    {\n\
        public int SomeField { get; set; }\n\
    }\n\
    \n\
    public struct MyStruct\n\
    {\n\
        public int SomeIntField { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    Id: number;\n\
    Name: string;\n\
    Title: string;\n\
    ListFields: Array<string>;\n\
    IEnumerableFields: Array<string>;\n\
    ArrayFields: Array<string>;\n\
    OptionalBool?: boolean;\n\
    SomeDate: string;\n\
    SomeDecimal: number;\n\
    SomeGuid: string;\n\
}\n\
\n\
declare interface MyOtherPoco {\n\
    SomeField: number;\n\
}\n\
\n\
declare interface MyStruct {\n\
    SomeIntField: number;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should handle multiple classes in the same file', function() {
		var result = LegacyAdapter(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
});
