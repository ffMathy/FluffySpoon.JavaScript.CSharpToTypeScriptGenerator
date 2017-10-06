import { FileParser, CSharpClass } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitter, PropertyEmitOptions } from './PropertyEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { FieldEmitter, FieldEmitOptions } from './FieldEmitter';
import { MethodEmitter, MethodEmitOptions } from './MethodEmitter';
import { Logger } from './Logger';

export interface ClassEmitOptionsBase {
	declare?: boolean;
	filter?: (classObject: CSharpClass) => boolean;

	enumEmitOptions?: EnumEmitOptions;
	propertyEmitOptions?: PropertyEmitOptions;
	interfaceEmitOptions?: InterfaceEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	fieldEmitOptions?: FieldEmitOptions;
	genericParameterTypeEmitOptions?: TypeEmitOptions;
	inheritedTypeEmitOptions?: TypeEmitOptions;
}

export interface ClassEmitOptions extends ClassEmitOptionsBase {
	perClassEmitOptions?: (classObject: CSharpClass) => PerClassEmitOptions;
}

export interface PerClassEmitOptions extends ClassEmitOptionsBase {
	name?: string;
}

export class ClassEmitter {
	private enumEmitter: EnumEmitter;
	private propertyEmitter: PropertyEmitter;
	private fieldEmitter: FieldEmitter;
	private methodEmitter: MethodEmitter;
	private interfaceEmitter: InterfaceEmitter;
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
		this.interfaceEmitter = new InterfaceEmitter(stringEmitter, logger);
	}

	emitClasses(classes: CSharpClass[], options?: ClassEmitOptions) {
		this.logger.log("Emitting classes", classes);

		for (var classObject of classes) {
			this.emitClass(classObject, options);
		}

		this.stringEmitter.removeLastNewLines();

		this.logger.log("Done emitting classes", classes);
	}

	emitClass(classObject: CSharpClass, options?: ClassEmitOptions) {
		options = this.prepareOptions(options);
		options = Object.assign(
			options,
			options.perClassEmitOptions(classObject));

		if (!options.filter(classObject))
			return;
			
		this.logger.log("Emitting class", classObject);

		this.emitClassInterface(classObject, options);
		this.stringEmitter.ensureNewParagraph();

		this.emitSubElementsInClass(classObject, options);
		this.stringEmitter.ensureNewParagraph();

		this.logger.log("Done emitting class", classObject);
	}

	private prepareOptions(options?: ClassEmitOptions) {
		if (!options) {
			options = {}
		}

		if (!options.filter) {
			options.filter = (classObject) => classObject.isPublic;
		}

		if (!options.perClassEmitOptions) {
			options.perClassEmitOptions = () => <PerClassEmitOptions>{};
		}

		return options;
	}

	private emitClassInterface(classObject: CSharpClass, options?: ClassEmitOptions & PerClassEmitOptions) {
		if (classObject.properties.length === 0 && classObject.methods.length === 0 && classObject.fields.length === 0) {
			this.logger.log("Skipping emitting body of class " + classObject.name + " because it contains no properties, fields or methods");
			return;
		}

		this.stringEmitter.writeIndentation();

		if (options.declare)
			this.stringEmitter.write("declare ");

		var className = options.name || classObject.name;
		this.logger.log("Emitting class " + className);

		this.stringEmitter.write("interface " + className);
		if(classObject.genericParameters)
			this.typeEmitter.emitGenericParameters(
				classObject.genericParameters,
				options.genericParameterTypeEmitOptions);

		if (classObject.inheritsFrom && this.typeEmitter.canEmitType(classObject.inheritsFrom, options.inheritedTypeEmitOptions)) {
			this.stringEmitter.write(" extends ");
			this.typeEmitter.emitType(
				classObject.inheritsFrom,
				options.inheritedTypeEmitOptions);
		}

		this.stringEmitter.write(" {");
		this.stringEmitter.writeLine();

		this.stringEmitter.increaseIndentation();

		if (classObject.fields.length > 0) {
			this.fieldEmitter.emitFields(classObject.fields, options.fieldEmitOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (classObject.properties.length > 0) {
			this.propertyEmitter.emitProperties(classObject.properties, options.propertyEmitOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if (classObject.methods.length > 0) {
			this.methodEmitter.emitMethods(classObject.methods, options.methodEmitOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		this.stringEmitter.removeLastNewLines();

		this.stringEmitter.decreaseIndentation();

		this.stringEmitter.writeLine();
		this.stringEmitter.writeLine("}");
	}

	private emitSubElementsInClass(classObject: CSharpClass, options?: ClassEmitOptions) {
		if (classObject.enums.length === 0 && classObject.classes.length === 0 && classObject.interfaces.length === 0) {
			this.logger.log("Skipping sub elements of class " + classObject.name + " because it contains no enums, classes or interfaces");
			return;
		}

		this.stringEmitter.writeIndentation();
		if (options.declare)
			this.stringEmitter.write("declare ");

		this.stringEmitter.write("namespace " + classObject.name + " {");
		this.stringEmitter.writeLine();

		this.stringEmitter.increaseIndentation();

		if(classObject.enums.length > 0) {
			var classEnumOptions = Object.assign(
				options.enumEmitOptions,
				<EnumEmitOptions>{
					declare: false
				});
			this.enumEmitter.emitEnums(
				classObject.enums,
				classEnumOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if(classObject.classes.length > 0) {
			var optionsClone = Object.assign({}, options);
			var subClassOptions = Object.assign(optionsClone, <ClassEmitOptions>{
				declare: false
			});
			this.emitClasses(
				classObject.classes,
				subClassOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		if(classObject.interfaces.length > 0) {
			var classInterfaceOptions = Object.assign(options, <InterfaceEmitOptions>{
				declare: false
			});
			this.interfaceEmitter.emitInterfaces(
				classObject.interfaces,
				classInterfaceOptions);
			this.stringEmitter.ensureNewParagraph();
		}

		this.stringEmitter.removeLastNewLines();

		this.stringEmitter.decreaseIndentation();

		this.stringEmitter.writeLine();
		this.stringEmitter.writeLine("}");
	}
}