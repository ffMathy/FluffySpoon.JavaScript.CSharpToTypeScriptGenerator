"use strict";
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
