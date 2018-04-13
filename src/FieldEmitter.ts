import { CSharpField, FieldParser } from '@fluffy-spoon/csharp-parser';

import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { OptionsHelper } from './OptionsHelper';

export interface FieldEmitOptionsBase {
	readOnly?: boolean;
	filter?: (field: CSharpField) => boolean;
	perFieldEmitOptions?: (field: CSharpField) => PerFieldEmitOptions;
}

export interface FieldEmitOptionsLinks {
	typeEmitOptions?: TypeEmitOptions;
}

export interface FieldEmitOptions extends FieldEmitOptionsBase, FieldEmitOptionsLinks {
}

export interface PerFieldEmitOptions extends FieldEmitOptionsBase, FieldEmitOptionsLinks {
	name?: string;
}

export class FieldEmitter {
	private optionsHelper: OptionsHelper;
	private typeEmitter: TypeEmitter;

	constructor(
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger
	) {
		if(!this.logger) 
			this.logger = new Logger();
		
		this.typeEmitter = new TypeEmitter(typeScriptEmitter, logger);
		this.optionsHelper = new OptionsHelper();
	}

	emitFields(fields: CSharpField[], options: FieldEmitOptions) {
		for (var property of fields) {
			this.emitField(property, options);
		}

		this.typeScriptEmitter.removeLastNewLines();
	}

	emitField(field: CSharpField, options: FieldEmitOptions & PerFieldEmitOptions) {
		var node = this.createTypeScriptFieldNode(field, options);
		if(!node) 
			return;

		this.typeScriptEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptFieldNode(field: CSharpField, options: FieldEmitOptions & PerFieldEmitOptions) {
		if(options.perFieldEmitOptions)
			options = this.optionsHelper.mergeOptionsRecursively<any>(
				options.perFieldEmitOptions(field), 
				options);

		if (!options.filter(field))
			return null;

		this.logger.log("Emitting field", field);

		var modifiers = new Array<ts.Modifier>();
		if ((typeof options.readOnly !== "boolean" || options.readOnly) && field.isReadOnly)
			modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));

		var node = ts.createPropertySignature(
			modifiers,
			options.name || field.name,
			field.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null,
			this.typeEmitter.createTypeScriptTypeReferenceNode(field.type, options.typeEmitOptions),
			null);

		this.logger.log("Done emitting field", field);

		return node;
	}

}
