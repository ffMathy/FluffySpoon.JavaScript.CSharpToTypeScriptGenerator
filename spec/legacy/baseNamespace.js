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
        public int SomeInt { get; set; }\n\
    }\n\
    \n\
    public enum MyEnum\n\
    {\n\
        One, Two\n\
    }\n\
}\n";

var expectedOutput = "declare module MyNamespace {\n\
    export interface MyPoco {\n\
        SomeInt: number;\n\
    }\n\
    \n\
    export enum MyEnum {\n\
        One = 0,\n\
        Two = 1\n\
    }\n\
}";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should use the baseNamespace option correctly', function() {
		var result = pocoGen(sampleFile, { baseNamespace: 'MyNamespace' });

        expect(result).toEqual(expectedOutput);
	});
});
