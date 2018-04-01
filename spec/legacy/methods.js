
// Disables multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
\n\
  public class MyPoco\n\
  {\n\
    public string MethodWithNoParameters() { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public string MethodWithMultipleParameters(string baz, int buz) { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public string MethodWithMultipleParametersAnnotated([Annotation1]string baz, [Annotation2]int buz) { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public async Task<string> MethodWithSingleParameterAsyncAndTaskStringReturnType(string baz) { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public async Task<IEnumerable<string>> MethodWithSingleParameterAsyncAndTaskStringArrayReturnType(string baz) { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public async Task MethodWithSingleParameterAsyncAndTaskVoidReturnType(string baz) { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public string MethodWithSingleParameter(string baz) { \n\
        if(true) {\n\
            //foobar\n\
        }\n\
    }\n\
    public string EmptyMethodWithNewLineParameters(\n\
        string baz,\n\
        int buz)\n\
    {}\n\
    public void EmptyVoid() {}\n\
  }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    MethodWithNoParameters(): string;\n\
    MethodWithMultipleParameters(baz: string, buz: number): string;\n\
    MethodWithMultipleParametersAnnotated(baz: string, buz: number): string;\n\
    MethodWithSingleParameterAsyncAndTaskStringReturnType(baz: string): Promise<string>;\n\
    MethodWithSingleParameterAsyncAndTaskStringArrayReturnType(baz: string): Promise<Array<string>>;\n\
    MethodWithSingleParameterAsyncAndTaskVoidReturnType(baz: string): Promise<void>;\n\
    MethodWithSingleParameter(baz: string): string;\n\
    EmptyMethodWithNewLineParameters(baz: string, buz: number): string;\n\
    EmptyVoid(): void;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function () {
    it('should transform a method correctly', function () {
        var result = LegacyAdapter(sampleFile);
        expect(result).toEqual(expectedOutput);
    });
});
