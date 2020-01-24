import { FileParser, CSharpEnum, CSharpEnumOption } from '@fluffy-spoon/csharp-parser';

import { TypeScriptEmitter } from './TypeScriptEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface EnumEmitOptionsBase {
	declare?: boolean;
	strategy?: "default" | "string-union";
	filter?: (enumObject: CSharpEnum) => boolean;
	useConst?: boolean;
}

export interface EnumEmitOptions extends EnumEmitOptionsBase {
}

export class EnumEmitter {
	constructor(
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger) 
	{
		if(!this.logger) 
			this.logger = new Logger();
	}

	emitEnums(enums: CSharpEnum[], options: EnumEmitOptions) {
		this.logger.log("Emitting enums", enums);

		for (var enumObject of enums) {
			this.emitEnum(enumObject, options);
		}

		this.logger.log("Done emitting enums", enums);
	}

	emitEnum(enumObject: CSharpEnum, options: EnumEmitOptions) {
		var node = this.createTypeScriptEnumNode(enumObject, options);
		if (!node)
			return;

		this.typeScriptEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptEnumNode(enumObject: CSharpEnum, options: EnumEmitOptions) {
		if (!options.filter(enumObject))
			return null;

		this.logger.log("Emitting enum", enumObject);

		var modifiers = new Array<ts.Modifier>();
		if (options.declare)
			modifiers.push(ts.createToken(ts.SyntaxKind.DeclareKeyword));

		if (options.useConst)
			modifiers.push(ts.createToken(ts.SyntaxKind.ConstKeyword));

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
