import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface EnumEmitOptions {
	declare?: boolean;
	strategy?: "default" | "string-union";
	filter?: (enumObject: CSharpEnum) => boolean;
}

export class EnumEmitter {
	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger) {

	}

	private prepareOptions(options?: EnumEmitOptions) {
		if (!options) {
			options = {}
		}

		if (!options.filter) {
			options.filter = (field) => field.isPublic;
		}

		if (!options.strategy) {
			options.strategy = "default";
		}

		return options;
	}

	emitEnums(enums: CSharpEnum[], options?: EnumEmitOptions) {
		this.logger.log("Emitting enums", enums);

		options = this.prepareOptions(options);

		for (var enumObject of enums) {
			this.emitEnum(enumObject, options);
		}

		this.logger.log("Done emitting enums", enums);
	}

	emitEnum(enumObject: CSharpEnum, options?: EnumEmitOptions) {
		var node = this.createTypeScriptEnumNode(enumObject, options);
		if (!node)
			return;

		this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptEnumNode(enumObject: CSharpEnum, options?: EnumEmitOptions) {
		options = this.prepareOptions(options);

		if (!options.filter(enumObject))
			return null;

		this.logger.log("Emitting enum", enumObject);

		var modifiers = new Array<ts.Modifier>();
		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		var node: ts.Statement;

		if (options.strategy === "string-union") {
			node = ts.createTypeAliasDeclaration(
				[],
				modifiers,
				enumObject.name,
				[],
				ts.createUnionOrIntersectionTypeNode(
					ts.SyntaxKind.UnionType,
					enumObject
						.options
						.map(v => ts.createTypeReferenceNode(ts.createIdentifier("'" + v.name + "'"), []))));
		} else {
			node = ts.createEnumDeclaration(
				[],
				modifiers,
				enumObject.name,
				enumObject
					.options
					.map(v => ts.createEnumMember(
						v.name,
						v.value ? ts.createNumericLiteral(v.value.toString()) : null)));
		}

		this.logger.log("Done emitting enum", enumObject);

		return node;
	}
}
