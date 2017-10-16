"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var OptionsHelper_1 = require("../src/OptionsHelper");
describe("OptionsHelper", function () {
    it("inheritance propagates correctly with simple values", function () {
        var helper = new OptionsHelper_1.OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance({
            classEmitOptions: {
                fieldEmitOptions: {
                    readOnly: 2
                }
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    fieldEmitOptions: {
                        readOnly: 3
                    }
                }
            },
            fieldEmitOptions: {
                readOnly: 1,
                filter: "foo"
            }
        });
        expect(options.fieldEmitOptions.readOnly).toBe(1);
        expect(options.classEmitOptions.fieldEmitOptions.readOnly).toBe(2);
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.readOnly).toBe(3);
        expect(options.fieldEmitOptions.filter).toBe("foo");
        expect(options.classEmitOptions.fieldEmitOptions.filter).toBe("foo");
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.filter).toBe("foo");
    });
    it("inheritance propagates correctly for functions", function () {
        var helper = new OptionsHelper_1.OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance({
            classEmitOptions: {
                fieldEmitOptions: {
                    perFieldEmitOptions: function (field) { return ({ name: field.name + "_FileClassField" }); }
                }
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    fieldEmitOptions: {
                        perFieldEmitOptions: function (field) { return ({ name: field.name + "_FileNamespaceClassField" }); }
                    }
                }
            },
            fieldEmitOptions: {
                perFieldEmitOptions: function (field) { return ({ name: field.name + "_FileField" }); }
            }
        });
        expect(options.fieldEmitOptions.perFieldEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpField("foo")).name).toBe("foo_FileField");
        expect(options.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpField("foo")).name).toBe("foo_FileClassField");
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpField("foo")).name).toBe("foo_FileNamespaceClassField");
    });
});
//# sourceMappingURL=OptionsHelperSpec.js.map