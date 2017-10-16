var fs = require('fs');

import { CSharpField, FieldParser } from 'fluffy-spoon.javascript.csharp-parser';

import { OptionsHelper } from '../src/OptionsHelper';
import { FileEmitOptions } from '../src/FileEmitter';
import { PerFieldEmitOptions } from '../src/FieldEmitter';

describe("OptionsHelper", function () {

	it("inheritance propagates correctly with simple values", function () {
		var helper = new OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance({
            classEmitOptions: {
                fieldEmitOptions: {
                    readOnly: <any>2
                }
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    fieldEmitOptions: {
                        readOnly: <any>3
                    }
                }
            },
            fieldEmitOptions: {
                readOnly: <any>1,
                filter: <any>"foo"
            }
        });

        expect(options.fieldEmitOptions.readOnly).toBe(<any>1);
        expect(options.classEmitOptions.fieldEmitOptions.readOnly).toBe(<any>2);
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.readOnly).toBe(<any>3);

        expect(options.fieldEmitOptions.filter).toBe(<any>"foo");
        expect(options.classEmitOptions.fieldEmitOptions.filter).toBe(<any>"foo");
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.filter).toBe(<any>"foo");
	});

	it("inheritance propagates correctly for functions", function () {
		var helper = new OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance({
            classEmitOptions: {
                fieldEmitOptions: {
                    perFieldEmitOptions: (field) => <PerFieldEmitOptions>{ name: field.name + "_FileClassField" }
                }
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    fieldEmitOptions: {
                        perFieldEmitOptions: (field) => <PerFieldEmitOptions>{ name: field.name + "_FileNamespaceClassField" }
                    }
                }
            },
            fieldEmitOptions: {
                perFieldEmitOptions: (field) => <PerFieldEmitOptions>{ name: field.name + "_FileField"}
            }
        });

        expect(options.fieldEmitOptions.perFieldEmitOptions(new CSharpField("foo")).name).toBe("foo_FileField");
        expect(options.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new CSharpField("foo")).name).toBe("foo_FileClassField");
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new CSharpField("foo")).name).toBe("foo_FileNamespaceClassField");
	});

});
