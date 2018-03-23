
// Disabled multiline warning, we're fine with ES5
// jshint -W043

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
\
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
        public bool? OptionalBool {get; set;}\n\
        public DateTime SomeDate {get;set;}\n\
        public decimal SomeDecimal {get;set;}\n\
        public Guid SomeGuid {get;set;}\n\
        public SomeOtherPoco AnotherPoco {get; set;}\n\
        public System.DateTime SomeSpecifiedDateTime {get; set;}\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    Id: number;\n\
    Name: string;\n\
    Title: string;\n\
    OptionalBool?: boolean;\n\
    SomeDate: Date;\n\
    SomeDecimal: number;\n\
    SomeGuid: string;\n\
    AnotherPoco: SomeOtherPoco;\n\
    SomeSpecifiedDateTime: Date;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should turn DateTime into Date with option set', function() {
		var result = LegacyAdapter(sampleFile, {
            dateTimeToDate: true
        });

        expect(result).toEqual(expectedOutput);
	});
});
