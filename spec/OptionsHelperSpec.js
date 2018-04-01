<<<<<<< HEAD
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var OptionsHelper_1 = require("../src/OptionsHelper");
describe("OptionsHelper", function () {
    it("should be able to handle merging of complex objects", function () {
        var helper = new OptionsHelper_1.OptionsHelper();
        var offset = 10;
        var result = helper.mergeOptions({
            a: 1337,
            b: "foo",
            q: 8,
            c: {
                d: true,
                e: 42,
                f: function (number) { return offset += number + 2; }
            }
        }, {
            o: 987,
            b: "foo1",
            c: {
                d: false,
                e: 42,
                f: function (number) { return offset += number + 1337; }
            }
        });
        expect(result.a).toBe(1337);
        expect(result.b).toBe("foo1");
        expect(result.o).toBe(987);
        expect(result.q).toBe(8);
        expect(result.c.d).toBe(false);
        expect(result.c.e).toBe(42);
        expect(result.c.f(20)).toBe(10 + 1337 + 2 + 20 + 20);
    });
    it("should be able to handle merging of declare values", function () {
        var helper = new OptionsHelper_1.OptionsHelper();
        var offset = 10;
        var result = helper.mergeOptions({
            namespaceEmitOptions: {
                skip: true,
                structEmitOptions: {
                    declare: true
                },
                interfaceEmitOptions: {
                    declare: true
                }
            }
        }, {
            namespaceEmitOptions: {
                skip: true,
                structEmitOptions: {
                    declare: false
                },
                interfaceEmitOptions: {
                    declare: false
                }
            }
        });
        expect(result.namespaceEmitOptions.skip).toBe(true);
        expect(result.namespaceEmitOptions.structEmitOptions.declare).toBe(false);
        expect(result.namespaceEmitOptions.interfaceEmitOptions.declare).toBe(false);
    });
});
=======
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
>>>>>>> 172c58a7e21dfc0ebeadd22407ab68a025e44a5e
//# sourceMappingURL=OptionsHelperSpec.js.map