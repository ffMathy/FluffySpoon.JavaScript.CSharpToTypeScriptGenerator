import { FileParser, CSharpClass, CSharpInterface } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitter, PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitter, FieldEmitOptions } from './FieldEmitter';
import { MethodEmitter, MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';

export interface InterfaceEmitOptionsBase {
	declare?: boolean;
	filter?: (method: CSharpInterface) => boolean;

	propertyEmitOptions?: PropertyEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	inheritedTypeEmitOptions?: TypeEmitOptions;
}

export interface InterfaceEmitOptions extends InterfaceEmitOptionsBase {
	perInterfaceEmitOptions?: (interfaceObject: CSharpInterface) => PerInterfaceEmitOptions;
}

export interface PerInterfaceEmitOptions extends InterfaceEmitOptionsBase {
	name?: string;
}

export class InterfaceEmitter {
	private propertyEmitter: PropertyEmitter;
	private methodEmitter: MethodEmitter;
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.propertyEmitter = new PropertyEmitter(stringEmitter, logger);
		this.methodEmitter = new MethodEmitter(stringEmitter, logger);
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitInterfaces(interfaces: CSharpInterface[], options?: InterfaceEmitOptions) {
		this.logger.log("Emitting interfaces", interfaces);

		for (var interfaceObject of interfaces) {
			this.emitInterface(interfaceObject, options);
		}

		this.stringEmitter.removeLastNewLines();

		this.logger.log("Done emitting interfaces", interfaces);
	}

	emitInterface(interfaceObject: CSharpInterface, options?: InterfaceEmitOptions) {
		options = Object.assign(
			this.prepareOptions(options),
			options.perInterfaceEmitOptions(interfaceObject));
			
		if (!options.filter(interfaceObject))
			return;
			
		this.logger.log("Emitting interface", interfaceObject);

		this.emitClassInterface(interfaceObject, options);

		this.stringEmitter.ensureLineSplit();

		this.logger.log("Done emitting interface", interfaceObject);
	}

	private prepareOptions(options?: InterfaceEmitOptions) {
		if (!options) {
			options = {
				declare: true
			}
		}

		if (!options.filter) {
			options.filter = () => true;
		}

		if (!options.perInterfaceEmitOptions) {
			options.perInterfaceEmitOptions = () => options;
		}

		return options;
	}

	private emitClassInterface(interfaceObject: CSharpInterface, options?: InterfaceEmitOptions & PerInterfaceEmitOptions) {
		if (interfaceObject.properties.length === 0 && interfaceObject.methods.length === 0) {
			this.logger.log("Skipping interface " + interfaceObject.name + " because it contains no properties or methods");
			return;
		}

		this.stringEmitter.writeIndentation();

		if (options.declare)
			this.stringEmitter.write("declare ");

		var className = options.name || interfaceObject.name;
		this.logger.log("Emitting interface " + className);

		this.stringEmitter.write("interface " + className);

		if (interfaceObject.inheritsFrom && this.typeEmitter.canEmitType(interfaceObject.inheritsFrom, options.inheritedTypeEmitOptions)) {
			this.stringEmitter.write(" extends ");
			this.typeEmitter.emitType(
				interfaceObject.inheritsFrom,
				options.inheritedTypeEmitOptions);
		}

		this.stringEmitter.write(" {");
		this.stringEmitter.writeLine();

		this.stringEmitter.increaseIndentation();

		if (interfaceObject.properties.length > 0) {
			this.propertyEmitter.emitProperties(interfaceObject.properties, options.propertyEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (interfaceObject.methods.length > 0) {
			this.methodEmitter.emitMethods(interfaceObject.methods, options.methodEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		this.stringEmitter.removeLastNewLines();

		this.stringEmitter.decreaseIndentation();

		this.stringEmitter.writeLine();
		this.stringEmitter.writeLine("}");

		this.stringEmitter.ensureLineSplit();
	}
}