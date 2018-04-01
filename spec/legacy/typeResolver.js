
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function () {
    it('should use the typeResolver option correctly for properties', function () {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int Id { get; set; }\n\
        public string NameOfStuff { get; set; }\n\
        public string Foo() { }\n\
        public string Foo(string foo, int bar) { }\n\
    }\n\
}\n";

        var expectedOutput = "declare interface MyPoco {\n\
    Id: Observable<number>;\n\
    NameOfStuff: Observable<string>;\n\
    Foo(): string;\n\
    Foo(foo: string, bar: number): string;\n\
}";

        var result = LegacyAdapter(sampleFile, { typeResolver: observablePropertyResolver });

        expect(result).toEqual(expectedOutput);

        function observablePropertyResolver(typeName, scope) {
            if(scope !== 'property-type') return typeName;
            return "Observable<" + typeName + ">";
        }
    });
    
    it('should use the typeResolver option correctly for method return types', function () {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int Id { get; set; }\n\
        public string NameOfStuff { get; set; }\n\
        public string Foo() { }\n\
        public string Foo(string foo, int bar) { }\n\
    }\n\
}\n";

        var expectedOutput = "declare interface MyPoco {\n\
    Id: number;\n\
    NameOfStuff: string;\n\
    Foo(): Observable<string>;\n\
    Foo(foo: string, bar: number): Observable<string>;\n\
}";

        var result = LegacyAdapter(sampleFile, { typeResolver: observablePropertyResolver });

        expect(result).toEqual(expectedOutput);

        function observablePropertyResolver(typeName, scope) {
            if(scope !== 'method-return-type') return typeName;
            return "Observable<" + typeName + ">";
        }
    });
    
    it('should use the typeResolver option correctly for method argument types', function () {

        var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int Id { get; set; }\n\
        public string NameOfStuff { get; set; }\n\
        public string Foo() { }\n\
        public string Foo(string foo, int bar) { }\n\
    }\n\
}\n";

        var expectedOutput = "declare interface MyPoco {\n\
    Id: number;\n\
    NameOfStuff: string;\n\
    Foo(): string;\n\
    Foo(foo: Observable<string>, bar: Observable<number>): string;\n\
}";

        var result = LegacyAdapter(sampleFile, { typeResolver: observablePropertyResolver });

        expect(result).toEqual(expectedOutput);

        function observablePropertyResolver(typeName, scope) {
            console.log("called mapper", scope, typeName);
            if(scope !== 'method-argument-type') return typeName;
            return "Observable<" + typeName + ">";
        }
    });
});