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
\n\
        [SomeAttribute(42)]\n\
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
        public int[] NumberArray { get; set; }\n\
        public List<int> NumberList { get; set; }\n\
        public bool? OptionalBool {get; set;}\n\
        public DateTime SomeDate {get;set;}\n\
        public decimal SomeDecimal {get;set;}\n\
        public Guid SomeGuid {get;set;}\n\
        public JObject DynamicContents { get; set; }\n\
        public dynamic DynamicToAny { get; set; }\n\
        public object ObjectToAny { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "interface MyPoco {\n\
    Id: number;\n\
    Name: string;\n\
    Title: string;\n\
    ListFields: string[];\n\
    IEnumerableFields: string[];\n\
    ArrayFields: string[];\n\
    NumberArray: number[];\n\
    NumberList: number[];\n\
    OptionalBool?: boolean;\n\
    SomeDate: string;\n\
    SomeDecimal: number;\n\
    SomeGuid: string;\n\
    DynamicContents: any;\n\
    DynamicToAny: any;\n\
    ObjectToAny: any;\n\
}\n";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform a POCO correctly', function() {
		var result = pocoGen(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
});
