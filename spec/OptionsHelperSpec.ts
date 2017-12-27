var fs = require('fs');

import { CSharpField, CSharpProperty, FieldParser } from 'fluffy-spoon.javascript.csharp-parser';

import { OptionsHelper } from '../src/options/OptionsHelper';
import { FileEmitOptions } from '../src/FileEmitter';
import { PerFieldEmitOptions } from '../src/FieldEmitter';
import { PerPropertyEmitOptions } from '../src/PropertyEmitter';

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
        var defaultedOptions = OptionsHelper.prepareFileEmitOptionDefaults({
            propertyEmitOptions: {
                perPropertyEmitOptions: (field) => <PerPropertyEmitOptions>{ name: field.name + "_FileField"}
            },
            namespaceEmitOptions: {
                classEmitOptions: {
                    propertyEmitOptions: {
                        perPropertyEmitOptions: (field) => <PerPropertyEmitOptions>{ name: field.name + "_FileNamespaceClassField" }
                    }
                }
            }
        });
        var options = OptionsHelper.prepareFileEmitOptionInheritance(defaultedOptions);

        expect(options.propertyEmitOptions.perPropertyEmitOptions(new CSharpProperty("foo")).name).toBe("foo_FileField");
        expect(options.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions(new CSharpProperty("foo")).name).toBe("foo_FileField");
        expect(options.namespaceEmitOptions.classEmitOptions.propertyEmitOptions.perPropertyEmitOptions(new CSharpProperty("foo")).name).toBe("foo_FileNamespaceClassField");
	});

});
