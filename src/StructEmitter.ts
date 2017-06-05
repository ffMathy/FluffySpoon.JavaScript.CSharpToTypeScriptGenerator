import { FileParser, CSharpClass, CSharpStruct } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitter, PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitter, FieldEmitOptions } from './FieldEmitter';
import { MethodEmitter, MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';

export interface StructEmitOptionsBase {
	declare: boolean;
    
	propertyEmitOptions?: PropertyEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	fieldEmitOptions?: FieldEmitOptions;
}

export interface StructEmitOptions extends StructEmitOptionsBase {
	perStructEmitOptions?: (struct: CSharpStruct) => PerStructEmitOptions;
}

export interface PerStructEmitOptions extends StructEmitOptionsBase {
	name?: string;
}

export class StructEmitter {
	private enumEmitter: EnumEmitter;
	private propertyEmitter: PropertyEmitter;
	private fieldEmitter: FieldEmitter;
	private methodEmitter: MethodEmitter;
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.enumEmitter = new EnumEmitter(stringEmitter, logger);
		this.propertyEmitter = new PropertyEmitter(stringEmitter, logger);
		this.fieldEmitter = new FieldEmitter(stringEmitter, logger);
		this.methodEmitter = new MethodEmitter(stringEmitter, logger);
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitStructs(structs: CSharpStruct[], options?: StructEmitOptions) {
		this.logger.log("Emitting structs", structs);

		for (var struct of structs) {
			this.emitStruct(struct, options);
		}

		this.stringEmitter.removeLastNewLines();

		this.logger.log("Done emitting structs", structs);
	}

	emitStruct(struct: CSharpStruct, options?: StructEmitOptions) {
		this.logger.log("Emitting struct", struct);

		options = this.prepareOptions(options);
		options = Object.assign(
			options,
			options.perStructEmitOptions(struct));

		this.emitStructInterface(struct, options);
		this.stringEmitter.ensureLineSplit();

		this.logger.log("Done emitting struct", struct);
	}

	private prepareOptions(options?: StructEmitOptions) {
		if (!options) {
			options = {
				declare: true
			}
		}

		if (!options.perStructEmitOptions) {
			options.perStructEmitOptions = () => options;
		}

		return options;
	}

	private emitStructInterface(struct: CSharpStruct, options?: StructEmitOptions & PerStructEmitOptions) {
		if (struct.properties.length === 0 && struct.methods.length === 0 && struct.fields.length === 0) {
			this.logger.log("Skipping interface " + struct.name + " because it contains no properties, fields or methods");
			return;
		}

		this.stringEmitter.writeIndentation();

		if (options.declare)
			this.stringEmitter.write("declare ");

		var className = options.name || struct.name;
		this.logger.log("Emitting interface " + className);

		this.stringEmitter.write("interface " + className);

		this.stringEmitter.write(" {");
		this.stringEmitter.writeLine();

		this.stringEmitter.increaseIndentation();

		if (struct.fields.length > 0) {
			this.fieldEmitter.emitFields(struct.fields, options.fieldEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (struct.properties.length > 0) {
			this.propertyEmitter.emitProperties(struct.properties, options.propertyEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (struct.methods.length > 0) {
			this.methodEmitter.emitMethods(struct.methods, options.methodEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		this.stringEmitter.removeLastNewLines();

		this.stringEmitter.decreaseIndentation();

		this.stringEmitter.writeLine();
		this.stringEmitter.writeLine("}");

		this.stringEmitter.ensureLineSplit();
	}
}