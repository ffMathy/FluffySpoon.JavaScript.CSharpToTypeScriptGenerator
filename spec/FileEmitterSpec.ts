var fs = require('fs');

import { Emitter, EmitOptions } from '../src/Emitter';
import { Logger } from '../src/Logger';
import { FileEmitOptions } from '../src/FileEmitter';
import { TypeScriptEmitter } from '../src/TypeScriptEmitter';
import { TypeEmitter, TypeEmitOptions } from '../src/Index';

import { CSharpFile, CSharpClass, CSharpMethod } from '@fluffy-spoon/csharp-parser';

import typescript = require("typescript");

Error.stackTraceLimit = 100;

function runCase(caseName: string, options?: () => EmitOptions) {
	it("should be able to handle case " + caseName, function (done) {
		let localCaseName = caseName;
		let localOptions = options;
		fs.readFile('./spec/cases/' + localCaseName + '.case.cs', 'utf8', function (err: any, caseInput: any) {
			let tsFileToUse = './spec/cases/' + localCaseName + '.expected.ts';
			let dtsFileToUse = './spec/cases/' + localCaseName + '.expected.d.ts';

			let fileToUse = fs.existsSync(tsFileToUse) ? tsFileToUse : dtsFileToUse;
			console.log("Comparing result with", fileToUse);

			fs.readFile(fileToUse, 'utf8', function (err: any, caseExpected: any) {
				caseExpected = caseExpected
					.replace(/\r/g, '')
					.replace(/    /g, '\t')
					.replace(/\t/g, '  ')
					.replace(/\n/g, '\\n\n')
					.trim();

				let emitter = new Emitter(caseInput);
				emitter.logger.setLogMethod((message, ...parameters) => {
					if (parameters.length > 0) {
						console.log(
							emitter.typeScriptEmitter.currentIndentation + message,
							parameters);
					} else {
						console.log(
							emitter.typeScriptEmitter.currentIndentation + message);
					}
				});
                
				let result = emitter.emit(localOptions ? localOptions() : null);
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
	runCase("Interface");

	runCase("AspNetCoreControllerToAngularClient", () => {
		var controllerClassFilter = (classObject: CSharpClass) => {
			var isTypeController = (type: {name: string}) => type.name.endsWith("Controller");

			var inheritsFromController = isTypeController(classObject) || !!classObject.inheritsFrom.filter(isTypeController)[0];
			var hasControllerAttribute = !!classObject.attributes.filter(a => a.name === "Controller")[0];
			var hasNonControllerAttribute = !!classObject.attributes.filter(a => a.name === "NonController")[0];
		  
			return (inheritsFromController || hasControllerAttribute) && !hasNonControllerAttribute;
		};
		
		var actionMethodFilter = (methodObject: CSharpMethod) => {
			var hasNonActionAttribute = !!methodObject.attributes.filter(a => a.name === "NonAction")[0];
			return methodObject.isPublic && !hasNonActionAttribute;
		};

		return <EmitOptions>{
			file: <FileEmitOptions>{
				onBeforeEmit: (file: CSharpFile, typescriptEmitter: TypeScriptEmitter) => {
					typescriptEmitter.clear(); //we clear all code the emitter would have normally written and take control ourselves

					typescriptEmitter.writeLine("import { Injectable } from '@angular/core';");
					typescriptEmitter.writeLine("import { HttpClient, HttpParams } from '@angular/common/http';");

					typescriptEmitter.ensureNewParagraph();
			
					var controllerClasses = file
						.getAllClassesRecursively()
						.filter(controllerClassFilter);
					
					for(var controllerClass of controllerClasses) {
						var controllerNameWithoutSuffix = controllerClass.name;
						if(controllerNameWithoutSuffix.endsWith("Controller"))
							controllerNameWithoutSuffix = controllerNameWithoutSuffix.substr(0, controllerNameWithoutSuffix.lastIndexOf("Controller"));

						typescriptEmitter.writeLine("@Injectable()");
						typescriptEmitter.writeLine(`export class ${controllerNameWithoutSuffix}Client {`);
						typescriptEmitter.increaseIndentation();

						typescriptEmitter.writeLine("constructor(private http: HttpClient) { }");
						typescriptEmitter.ensureNewParagraph();

						var actionMethods = controllerClass
							.methods
							.filter(actionMethodFilter);
				
						for(var actionMethod of actionMethods) {								
							var actionNameCamelCase = actionMethod.name.substr(0, 1).toLowerCase() + actionMethod.name.substr(1);
							typescriptEmitter.write(`async ${actionNameCamelCase}(`);

							const typeEmitter = new TypeEmitter(typescriptEmitter, new Logger());

							var parameterOffset = 0;
							for(var parameter of actionMethod.parameters) {
								if(parameterOffset > 0)
									typescriptEmitter.write(", ");

								typescriptEmitter.write(`${parameter.name}: `);

								typeEmitter.emitType(parameter.type);

								parameterOffset++;
							}

							typescriptEmitter.write("): ");

							typeEmitter.emitType(actionMethod.returnType, { 
								mapper: (type, suggested) => {
									if(type.name !== "Task<>") return `Promise<${suggested}>`;
									return suggested;
								}
							});

							typescriptEmitter.writeLine(" {");
							typescriptEmitter.increaseIndentation();

							var method = "get";
							for(var actionAttribute of actionMethod.attributes) {
								switch(actionAttribute.name) {
									case "HttpPost": method = "post"; break;
									case "HttpPut": method = "put"; break;
									case "HttpPatch": method = "patch"; break;
								}
							}

							typescriptEmitter.write(`return this.http.${method}('/api/${controllerNameWithoutSuffix.toLowerCase()}/${actionMethod.name.toLowerCase()}', new HttpParams()`);

							for(var parameter of actionMethod.parameters) {
								typescriptEmitter.write(`.append('${parameter.name}', ${parameter.name})`);
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
		}
	});

});
