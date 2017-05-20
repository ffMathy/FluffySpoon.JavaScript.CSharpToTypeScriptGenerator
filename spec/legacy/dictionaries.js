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
        public IDictionary<int, double> Stuff {get;set;}\n\
    }\n\
}\n";

var expectedOutput = "interface MyPoco {\n\
    Stuff: { [index: number]: number };\n\
}\n";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform a POCO with a dictionary property correctly', function() {

		var result = pocoGen(sampleFile);
        
        expect(result).toEqual(expectedOutput);
	});
});
