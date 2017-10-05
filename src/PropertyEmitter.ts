import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

export interface PropertyEmitOptionsBase {
	readOnly?: boolean;
	filter?: (property: CSharpProperty) => boolean;
	typeEmitOptions?: TypeEmitOptions;
}

export interface PropertyEmitOptions extends PropertyEmitOptionsBase {
	perPropertyEmitOptions?: (property: CSharpProperty) => PerPropertyEmitOptions;
}

export interface PerPropertyEmitOptions extends PropertyEmitOptionsBase {
	name?: string;
}

export class PropertyEmitter {
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitProperties(properties: CSharpProperty[], options?: PropertyEmitOptions & PerPropertyEmitOptions) {
		options = this.prepareOptions(options);

		for (var property of properties) {
			this.emitProperty(property, options);
		}
	}

	emitProperty(property: CSharpProperty, options?: PropertyEmitOptions & PerPropertyEmitOptions) {
		options = this.prepareOptions(options);
		options = Object.assign(
			options,
			options.perPropertyEmitOptions(property));

		if (!options.filter(property))
			return;

		this.stringEmitter.writeIndentation();

		if (options.readOnly)
			this.stringEmitter.write("readonly ");

		this.stringEmitter.write((options.name || property.name) + (property.type.isNullable ? "?" : "") + ": ");
		this.typeEmitter.emitType(property.type, options.typeEmitOptions);
		this.stringEmitter.write(";");
		this.stringEmitter.writeLine();
	}

	private prepareOptions(options?: PropertyEmitOptions) {
		if (!options) {
			options = {};
		}

		if (!options.filter) {
			options.filter = (property) => property.isPublic;
		}

		if (!options.perPropertyEmitOptions) {
			options.perPropertyEmitOptions = () => options;
		}

		return options;
	}

}