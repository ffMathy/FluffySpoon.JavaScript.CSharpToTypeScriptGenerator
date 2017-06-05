import { CSharpField, FieldParser } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

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

	emitFields(fields: CSharpField[], options?: FieldEmitOptions & PerFieldEmitOptions) {
		options = this.prepareOptions(options);

		for (var property of fields) {
			this.emitField(property, options);
		}

		this.stringEmitter.removeLastNewLines();
	}

	emitField(field: CSharpField, options?: FieldEmitOptions & PerFieldEmitOptions) {
		options = Object.assign(
			this.prepareOptions(options),
			options.perFieldEmitOptions(field));

		if (!options.filter(field))
			return;

		this.logger.log("Emitting field " + field.name);

		this.stringEmitter.writeIndentation();

		if (options.readOnly)
			this.stringEmitter.write("readonly ");

		this.stringEmitter.write((options.name || field.name) + ": ");
		this.typeEmitter.emitType(field.type, options.typeEmitOptions);
		this.stringEmitter.write(";");

		this.stringEmitter.ensureNewLine();
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