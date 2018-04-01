"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var fluffy_spoon_javascript_csharp_parser_1 = require("fluffy-spoon.javascript.csharp-parser");
var OptionsHelper_1 = require("../src/options/OptionsHelper");
describe("OptionsHelper", function () {
    /*it("inheritance propagates correctly with simple values", function () {
        var helper = new OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance(
            helper.prepareFileEmitOptionDefaults({
                classEmitOptions: {
                    fieldEmitOptions: {
                        readOnly: <any>2
                    }
                },
                namespaceEmitOptions: {
                    classEmitOptions: {
                        fieldEmitOptions: {
                        }
                    }
                },
                fieldEmitOptions: {
                    readOnly: <any>1,
                    filter: () => {
                        console.log("filter invoked");
                        return false;
                    }
                }
            }));

        expect(options.fieldEmitOptions.readOnly).toBe(<any>1);
        expect(options.classEmitOptions.fieldEmitOptions.readOnly).toBe(<any>2);
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.readOnly).toBe(<any>2);

    });*/
    it("inheritance propagates correctly for functions from file to class", function () {
        var defaultedOptions = OptionsHelper_1.OptionsHelper.prepareFileEmitOptionDefaults({
            propertyEmitOptions: {
                perPropertyEmitOptions: function (field) { return ({ name: field.name + "_FileField" }); }
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    propertyEmitOptions: {
                        perPropertyEmitOptions: function (field) { return ({ name: field.name + "_FileNamespaceClassField" }); }
                    }
                }
            }
        });
        var options = OptionsHelper_1.OptionsHelper.prepareFileEmitOptionInheritance(defaultedOptions);
        expect(options.propertyEmitOptions.perPropertyEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpProperty("foo")).name).toBe("foo_FileField");
        expect(options.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpProperty("foo")).name).toBe("foo_FileField");
        expect(options.namespaceEmitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions(new fluffy_spoon_javascript_csharp_parser_1.CSharpProperty("foo")).name).toBe("foo_FileNamespaceClassField");
    });
});
//# sourceMappingURL=OptionsHelperSpec.js.map