
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
namespace MyNamespace.Domain\n\
{\n\
    public class MyPoco\n\
    {\n\
        public int Id { get; set; }\n\
        public string NameOfStuff { get; set; }\n\
        public string Title { get; set; }\n\
    }\n\
}\n";

var expectedOutput = "declare interface MyPoco {\n\
    id: number;\n\
    nameOfStuff: string;\n\
    title: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
  it('should use the propertyNameResolver option correctly', function() {
    var result = LegacyAdapter(sampleFile, { propertyNameResolver : camelCaseResolver });

    expect(result).toEqual(expectedOutput);

    function camelCaseResolver(propertyName) {
      return propertyName[0].toLowerCase() + propertyName.substring(1);
    }
  });
});
