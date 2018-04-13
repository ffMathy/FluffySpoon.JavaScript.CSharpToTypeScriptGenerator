var fs = require('fs');

import { Emitter, EmitOptions } from '../src/Emitter';
import { Logger } from '../src/Logger';
import { FileEmitOptions } from '../src/FileEmitter';
import { TypeScriptEmitter } from '../src/TypeScriptEmitter';
import { TypeEmitter, TypeEmitOptions } from '../src/Index';

import { CSharpFile, CSharpClass, CSharpMethod, CSharpType, TypeParser } from '@fluffy-spoon/csharp-parser';

import typescript = require("typescript");

describe("TypeEmitter", function () {
	it("should be able to handle type mapping", function (done) {
		var typeEmitter = new TypeEmitter(new TypeScriptEmitter());
		var typeParser = new TypeParser();

		var csharpType = typeParser.parseType("Task<IEnumerable<string>>");
		expect(csharpType.name).toBe("Task<>");
		expect(csharpType.isGeneric).toBe(true);
		expect(csharpType.genericParameters[0].name).toBe("IEnumerable<>");
		expect(csharpType.genericParameters[0].isGeneric).toBe(true);
		expect(csharpType.genericParameters[0].genericParameters[0].name).toBe("string");
		expect(csharpType.genericParameters[0].genericParameters[0].isGeneric).toBe(false);

		expect(typeEmitter.convertTypeToTypeScript(csharpType)).toBe("Promise<Array<string>>");

		done();
	});

});
