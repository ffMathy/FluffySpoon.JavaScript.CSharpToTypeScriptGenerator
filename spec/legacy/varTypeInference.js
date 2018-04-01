
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should transform types correctly', function() {

        var typeMappings = {
            'IEnumerable<string>': 'Array<string>',
            'Task<string>': 'Promise<string>',
			'Task<IEnumerable<string>>': 'Promise<Array<string>>'
        };

        for(var sourceType in typeMappings) {
            var destinationType = typeMappings[sourceType];

            var sampleFile = "\
public class MyPoco\n\
    {\n\
        public " + sourceType + " Foo { get; set; }\n\
    }\n\
}\n";

            var expectedOutput = "declare interface MyPoco {\n\
    Foo: " + destinationType + ";\n\
}";

            var result = LegacyAdapter(sampleFile);
            
            expect(result).toEqual(expectedOutput);

        }
	});
});
