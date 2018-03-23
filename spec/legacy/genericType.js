
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
public class Profile\n\
{\n\
    public Entry<bool> Value { get; set; }\n\
}\n";

var expectedOutput = "\
declare interface Profile {\n\
    Value: Entry<boolean>;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
    it('should convert a generic property correctly', function() {
        var result = LegacyAdapter(sampleFile);
        
        expect(result).toEqual(expectedOutput);
    });
});
