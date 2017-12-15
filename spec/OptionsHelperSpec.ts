var fs = require('fs');

import { CSharpField, FieldParser } from 'fluffy-spoon.javascript.csharp-parser';

import { OptionsHelper } from '../src/OptionsHelper';
import { FileEmitOptions } from '../src/FileEmitter';
import { PerFieldEmitOptions } from '../src/FieldEmitter';

describe("OptionsHelper", function () {

	it("inheritance propagates correctly with simple values", function () {
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

    });

	it("inheritance propagates correctly for functions", function () {
		var helper = new OptionsHelper();
        var options = helper.prepareFileEmitOptionInheritance(
            helper.prepareFileEmitOptionDefaults({
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
            }));

        expect(options.fieldEmitOptions.perFieldEmitOptions(new CSharpField("foo")).name).toBe("foo_FileField");
        expect(options.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new CSharpField("foo")).name).toBe("foo_FileClassField");
        expect(options.namespaceEmitOptions.classEmitOptions.fieldEmitOptions.perFieldEmitOptions(new CSharpField("foo")).name).toBe("foo_FileNamespaceClassField");
	});

});
