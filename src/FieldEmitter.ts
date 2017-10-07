import { CSharpField, FieldParser } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface FieldEmitOptionsBase {
	readOnly?: boolean;
	typeEmitOptions?: TypeEmitOptions;
	filter?: (field: CSharpField) => boolean;
}

export interface FieldEmitOptions extends FieldEmitOptionsBase {
	perFieldEmitOptions?: (field: CSharpField) => PerFieldEmitOptions;
}

export interface PerFieldEmitOptions extends FieldEmitOptionsBase {
	name?: string;
}

export class FieldEmitter {
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitFields(fields: CSharpField[], options?: FieldEmitOptions) {
		for (var property of fields) {
			this.emitField(property, options);
		}

		this.stringEmitter.removeLastNewLines();
	}

	emitField(field: CSharpField, options?: FieldEmitOptions & PerFieldEmitOptions) {
		var node = this.createTypeScriptFieldNode(field, options);
		if(!node) 
			return;

		this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptFieldNode(field: CSharpField, options?: FieldEmitOptions & PerFieldEmitOptions) {
		options = Object.assign(
			this.prepareOptions(options),
			options.perFieldEmitOptions(field));

		if (!options.filter(field))
			return;

		this.logger.log("Emitting field " + field.name);

		var modifiers = new Array<ts.Modifier>();
		if (options.readOnly)
			modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));

		var node = ts.createPropertySignature(
			modifiers,
			options.name || field.name,
			field.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null,
			this.typeEmitter.createTypeScriptTypeReferenceNode(field.type, options.typeEmitOptions),
			null);

		return node;
	}

	private prepareOptions(options?: FieldEmitOptions) {
		if (!options) {
			options = {};
		}

		if (!options.filter) {
			options.filter = (field) => field.isPublic;
		}

		if (!options.perFieldEmitOptions) {
			options.perFieldEmitOptions = () => options;
		}

		return options;
	}

}