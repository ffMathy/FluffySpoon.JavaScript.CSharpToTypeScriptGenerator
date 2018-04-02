"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var Emitter_1 = require("../src/Emitter");
var Logger_1 = require("../src/Logger");
var Index_1 = require("../src/Index");
Error.stackTraceLimit = 100;
function runCase(caseName, options) {
    it("should be able to handle case " + caseName, function (done) {
        var localCaseName = caseName;
        var localOptions = options;
        fs.readFile('./spec/cases/' + localCaseName + '.case.cs', 'utf8', function (err, caseInput) {
            var tsFileToUse = './spec/cases/' + localCaseName + '.expected.ts';
            var dtsFileToUse = './spec/cases/' + localCaseName + '.expected.d.ts';
            var fileToUse = fs.existsSync(tsFileToUse) ? tsFileToUse : dtsFileToUse;
            console.log("Comparing result with", fileToUse);
            fs.readFile(fileToUse, 'utf8', function (err, caseExpected) {
                caseExpected = caseExpected
                    .replace(/\r/g, '')
                    .replace(/    /g, '\t')
                    .replace(/\t/g, '  ')
                    .replace(/\n/g, '\\n\n')
                    .trim();
                var emitter = new Emitter_1.Emitter(caseInput);
                emitter.logger.setLogMethod(function (message) {
                    var parameters = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        parameters[_i - 1] = arguments[_i];
                    }
                    if (parameters.length > 0) {
                        console.log(emitter.typeScriptEmitter.currentIndentation + message, parameters);
                    }
                    else {
                        console.log(emitter.typeScriptEmitter.currentIndentation + message);
                    }
                });
                var result = emitter.emit(localOptions ? localOptions() : null);
                result = result
                    .replace(/\r/g, '')
                    .replace(/    /g, '\t')
                    .replace(/\t/g, '  ')
                    .replace(/\n/g, '\\n\n')
                    .trim();
                expect(result).toBe(caseExpected);
                done();
            });
        });
    });
}
describe("UseCases", function () {
    runCase("Enum");
    runCase("Property");
    runCase("Class");
    runCase("AspNetCoreControllerToAngularClient", function () {
        var controllerClassFilter = function (classObject) {
            var isTypeController = function (type) { return type.name.endsWith("Controller"); };
            var inheritsFromController = isTypeController(classObject) || !!classObject.inheritsFrom.filter(isTypeController)[0];
            var hasControllerAttribute = !!classObject.attributes.filter(function (a) { return a.name === "Controller"; })[0];
            var hasNonControllerAttribute = !!classObject.attributes.filter(function (a) { return a.name === "NonController"; })[0];
            return (inheritsFromController || hasControllerAttribute) && !hasNonControllerAttribute;
        };
        var actionMethodFilter = function (methodObject) {
            var hasNonActionAttribute = !!methodObject.attributes.filter(function (a) { return a.name === "NonAction"; })[0];
            return methodObject.isPublic && !hasNonActionAttribute;
        };
        return {
            file: {
                onBeforeEmit: function (file, typescriptEmitter) {
                    typescriptEmitter.clear(); //we clear all code the emitter would have normally written and take control ourselves
                    typescriptEmitter.writeLine("import { Injectable } from '@angular/core';");
                    typescriptEmitter.writeLine("import { HttpClient, HttpParams } from '@angular/common/http';");
                    typescriptEmitter.ensureNewParagraph();
                    var controllerClasses = file
                        .getAllClassesRecursively()
                        .filter(controllerClassFilter);
                    for (var _i = 0, controllerClasses_1 = controllerClasses; _i < controllerClasses_1.length; _i++) {
                        var controllerClass = controllerClasses_1[_i];
                        var controllerNameWithoutSuffix = controllerClass.name;
                        if (controllerNameWithoutSuffix.endsWith("Controller"))
                            controllerNameWithoutSuffix = controllerNameWithoutSuffix.substr(0, controllerNameWithoutSuffix.lastIndexOf("Controller"));
                        typescriptEmitter.writeLine("@Injectable()");
                        typescriptEmitter.writeLine("export class " + controllerNameWithoutSuffix + "Client {");
                        typescriptEmitter.increaseIndentation();
                        typescriptEmitter.writeLine("constructor(private http: HttpClient) { }");
                        typescriptEmitter.ensureNewParagraph();
                        var actionMethods = controllerClass
                            .methods
                            .filter(actionMethodFilter);
                        for (var _a = 0, actionMethods_1 = actionMethods; _a < actionMethods_1.length; _a++) {
                            var actionMethod = actionMethods_1[_a];
                            var actionNameCamelCase = actionMethod.name.substr(0, 1).toLowerCase() + actionMethod.name.substr(1);
                            typescriptEmitter.write("async " + actionNameCamelCase + "(");
                            var typeEmitter = new Index_1.TypeEmitter(typescriptEmitter, new Logger_1.Logger());
                            var parameterOffset = 0;
                            for (var _b = 0, _c = actionMethod.parameters; _b < _c.length; _b++) {
                                var parameter = _c[_b];
                                if (parameterOffset > 0)
                                    typescriptEmitter.write(", ");
                                typescriptEmitter.write(parameter.name + ": ");
                                typeEmitter.emitType(parameter.type);
                                parameterOffset++;
                            }
                            typescriptEmitter.write("): ");
                            typeEmitter.emitType(actionMethod.returnType, {
                                mapper: function (type, suggested) {
                                    debugger;
                                    if (type.name !== "Task<>")
                                        return "Promise<" + suggested + ">";
                                    return suggested;
                                }
                            });
                            typescriptEmitter.writeLine(" {");
                            typescriptEmitter.increaseIndentation();
                            var method = "get";
                            for (var _d = 0, _e = actionMethod.attributes; _d < _e.length; _d++) {
                                var actionAttribute = _e[_d];
                                switch (actionAttribute.name) {
                                    case "HttpPost":
                                        method = "post";
                                        break;
                                    case "HttpPut":
                                        method = "put";
                                        break;
                                    case "HttpPatch":
                                        method = "patch";
                                        break;
                                }
                            }
                            typescriptEmitter.write("return this.http." + method + "('/api/" + controllerNameWithoutSuffix.toLowerCase() + "/" + actionMethod.name.toLowerCase() + "', new HttpParams()");
                            for (var _f = 0, _g = actionMethod.parameters; _f < _g.length; _f++) {
                                var parameter = _g[_f];
                                typescriptEmitter.write(".append('" + parameter.name + "', " + parameter.name + ")");
                            }
                            typescriptEmitter.writeLine(").toPromise();");
                            typescriptEmitter.decreaseIndentation();
                            typescriptEmitter.write("}");
                            typescriptEmitter.ensureNewParagraph();
                        }
                        typescriptEmitter.ensureNewLine();
                        typescriptEmitter.decreaseIndentation();
                        typescriptEmitter.write("}");
                        typescriptEmitter.ensureNewParagraph();
                    }
                }
            }
        };
    });
});
//# sourceMappingURL=FileEmitterSpec.js.map