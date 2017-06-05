/// <reference path="../typings/tsd.d.ts" />
// Disabled multiline warning, we're fine with ES5
// jshint -W043
var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function () {
    it('should use the prefixWithI option correctly for multiple files', function () {
        
        var sampleFile = "\
using System;\n\
\n\
namespace PocoTest\n\
{\n\
    public class FirstClass\n\
    {\n\
        string foo;\n\
    }\n\
}\n\
namespace PocoTest\n\
{\n\
    public class SecondClass\n\
    {\n\
        string foo;\n\
    }\n\
	\n\
    public class ThirdClass\n\
    {\n\
        string foo;\n\
    }\n\
}";

        var expectedOutput = "\
interface IFirstClass {\n\
}\n\
\n\
interface ISecondClass {\n\
}\n\
\n\
interface IThirdClass {\n\
}";
        var options = {
                prefixWithI: true
          };
        var result = pocoGen(sampleFile, options);

        expect(result).toEqual(expectedOutput);
    });

    it('should use the prefixWithI option correctly for multiple files and inheritance', function () {
        
        var sampleFile = "\
using System;\n\
\n\
namespace PocoTest\n\
{\n\
    public class FirstClass : BaseClass\n\
    {\n\
        string foo;\n\
    }\n\
}\n\
namespace PocoTest\n\
{\n\
    public class SecondClass\n\
    {\n\
        string foo;\n\
    }\n\
	\n\
    public class ThirdClass : BaseClass\n\
    {\n\
        string foo;\n\
    }\n\
}";

        var expectedOutput = "\
interface IFirstClass extends IBaseClass {\n\
}\n\
\n\
interface ISecondClass {\n\
}\n\
\n\
interface IThirdClass extends IBaseClass {\n\
}";
        var options = {
                prefixWithI: true
          };
        var result = pocoGen(sampleFile, options);

        expect(result).toEqual(expectedOutput);
    });
});