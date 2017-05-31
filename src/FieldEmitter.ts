import { CSharpField, FieldParser } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';

export interface FieldEmitOptionsBase {
	readOnly?: boolean;
}

export interface FieldEmitOptions extends FieldEmitOptionsBase {
	filter?: (field: CSharpField) => boolean;
	perFieldEmitOptions?: (field: CSharpField) => FieldEmitOptions;

	typeEmitOptions?: TypeEmitOptions
}

export interface PerFieldEmitOptions extends FieldEmitOptionsBase {
	name?: string;
}

export class FieldEmitter {
	private typeEmitter: TypeEmitter;

	constructor(private stringEmitter: StringEmitter) {
		this.typeEmitter = new TypeEmitter(stringEmitter);
	}

	emitFields(fields: CSharpField[], options?: FieldEmitOptions & PerFieldEmitOptions) {
		options = this.prepareOptions(options);

		for (var property of fields) {
			this.emitField(property, options);
		}
	}

	emitField(field: CSharpField, options?: FieldEmitOptions & PerFieldEmitOptions) {
		console.log(options);
		options = Object.assign(
			this.prepareOptions(options),
			options.perFieldEmitOptions(field));

		if (!options.filter(field))
			return;

		this.stringEmitter.writeIndentation();

		if (options.readOnly)
			this.stringEmitter.write("readonly ");

		this.stringEmitter.write((options.name || field.name) + ": ");
		this.typeEmitter.emitType(field.type, options.typeEmitOptions);
		this.stringEmitter.write(";");
		this.stringEmitter.writeLine();
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