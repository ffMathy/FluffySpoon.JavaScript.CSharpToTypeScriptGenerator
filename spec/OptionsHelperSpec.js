"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var OptionsHelper_1 = require("../src/OptionsHelper");
describe("OptionsHelper", function () {
    it("inheritance propagates correctly with simple values", function () {
        var helper = new OptionsHelper_1.OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance(helper.prepareFileEmitOptionDefaults({
            classEmitOptions: {
                fieldEmitOptions: {
                    readOnly: 2
                }
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    fieldEmitOptions: {}
                }
            },
            fieldEmitOptions: {
                readOnly: 1,
                filter: function () {
                    console.log("filter invoked");
                    return false;
                }
            }
        }));
        expect(options.fieldEmitOptions.readOnly).toBe(1);
        expect(options.classEmitOptions.fieldEmitOptions.readOnly).toBe(2);
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.readOnly).toBe(2);
    });
    it("inheritance propagates correctly for functions", function () {
        var helper = new OptionsHelper_1.OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance(helper.prepareFileEmitOptionDefaults({
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
        }));
        expect(options.fieldEmitOptions.perFieldEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpField("foo")).name).toBe("foo_FileField");
        expect(options.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpField("foo")).name).toBe("foo_FileClassField");
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpField("foo")).name).toBe("foo_FileNamespaceClassField");
    });
});
//# sourceMappingURL=OptionsHelperSpec.js.map