
// Disabled multiline warning, we're fine with ES5
// jshint -W043
var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function () {
    it('should use the interfaceNameResolver option correctly for base class names', function () {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco :  BasePoco\n\
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
            set;\n\ }\n\
        public List<string> ListFields { get; set; }\n\
        public IEnumerable<string> IEnumerableFields { get; set; }\n\
        public ICollection<string> ICollectionFields { get; set; }\n\
        public string[] ArrayFields { get; set; }\n\
        public bool? OptionalBool {get; set;}\n\
        public DateTime SomeDate {get;set;}\n\
        public decimal SomeDecimal {get;set;}\n\
    }\n\
}\n";

        var expectedOutput = "declare interface myPoco extends basePoco {\n\
    Id: number;\n\
    Name: string;\n\
    Title: string;\n\
    ListFields: Array<string>;\n\
    IEnumerableFields: Array<string>;\n\
    ICollectionFields: Array<string>;\n\
    ArrayFields: Array<string>;\n\
    OptionalBool?: boolean;\n\
    SomeDate: string;\n\
    SomeDecimal: number;\n\
}";

        var result = LegacyAdapter(sampleFile, { interfaceNameResolver: camelCaseResolver, debug: true });

        expect(result).toEqual(expectedOutput);

        function camelCaseResolver(interfaceName) {
            return interfaceName[0].toLowerCase() + interfaceName.substring(1);
        }
    });

    it('should use the prefixWithI option correctly for base class names even when existing name resolver is set', function () {
        
        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco :  BasePoco\n\
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
            set;\n\ }\n\
        public List<string> ListFields { get; set; }\n\
        public IEnumerable<string> IEnumerableFields { get; set; }\n\
        public ICollection<string> ICollectionFields { get; set; }\n\
        public string[] ArrayFields { get; set; }\n\
        public bool? OptionalBool {get; set;}\n\
        public DateTime SomeDate {get;set;}\n\
        public decimal SomeDecimal {get;set;}\n\
        public Guid SomeGuid {get;set;}\n\
    }\n\
}\n";

        var expectedOutput = "declare interface ImyPoco extends IbasePoco {\n\
    Id: number;\n\
    Name: string;\n\
    Title: string;\n\
    ListFields: Array<string>;\n\
    IEnumerableFields: Array<string>;\n\
    ICollectionFields: Array<string>;\n\
    ArrayFields: Array<string>;\n\
    OptionalBool?: boolean;\n\
    SomeDate: string;\n\
    SomeDecimal: number;\n\
    SomeGuid: string;\n\
}";

        var result = LegacyAdapter(sampleFile, { interfaceNameResolver: camelCaseResolver, prefixWithI: true, debug: true });

        expect(result).toEqual(expectedOutput);

        function camelCaseResolver(interfaceName) {
            return interfaceName[0].toLowerCase() + interfaceName.substring(1);
        }
    });
});
