
// Disables multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
public interface IPoco\n\
{\n\
  public int Id { get; set; }\n\
}\n\
\n\
public class MyPoco : IPoco\n\
{\n\
    public int Id { get; set; }\n\
    public string Name { get; set; }\n\
}\n";

var expectedOutput = "declare interface IPoco {\n\
    Id: number;\n\
}\n\
\n\
declare interface MyPoco extends IPoco {\n\
    Id: number;\n\
    Name: string;\n\
}";

var LegacyAdapter = require('../../dist/spec/legacy/adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should export an interface if option is set', function() {
		var result = LegacyAdapter(sampleFile, { includeInterfaces: true });
        
        expect(result).toEqual(expectedOutput);
	});
});

