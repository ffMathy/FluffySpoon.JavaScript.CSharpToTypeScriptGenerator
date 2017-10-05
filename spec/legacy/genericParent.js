/// <reference path="../typings/tsd.d.ts" />
// Disabled multiline warning, we're fine with ES5
// jshint -W043

var sampleFile = "\
using System;\n\
\n\
public class LatLng : IEquatable<LatLng>\n\
{\n\
  public double lat { get; set; }\n\
  public double lng { get; set; }\n\
}\n";

var expectedOutput = "interface LatLng extends IEquatable<LatLng> {\n\
    lat: number;\n\
    lng: number;\n\
}";

var pocoGen = require('./adapters/legacyAdapter.js');

describe('typescript-cs-poco', function() {
	it('should convert a class with a generic base class correctly', function() {
		var result = pocoGen(sampleFile);
        
    expect(result).toEqual(expectedOutput);
	});
});
