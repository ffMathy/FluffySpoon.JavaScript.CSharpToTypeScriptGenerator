import { FileParser, CSharpClass } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { PropertyEmitter, PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitter, FieldEmitOptions } from './FieldEmitter';
import { MethodEmitter, MethodEmitOptions } from './MethodEmitter';

export interface ClassEmitOptionsBase {
	declare: boolean;

	enumEmitOptions?: EnumEmitOptions;
	propertyEmitOptions?: PropertyEmitOptions;
	methodEmitOptions?: MethodEmitOptions;
	fieldEmitOptions?: FieldEmitOptions;
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
	private typeEmitter: TypeEmitter;

    constructor(
        private stringEmitter: StringEmitter)
    {
        this.enumEmitter = new EnumEmitter(stringEmitter);
		this.propertyEmitter = new PropertyEmitter(stringEmitter);
		this.fieldEmitter = new FieldEmitter(stringEmitter);
		this.methodEmitter = new MethodEmitter(stringEmitter);
		this.typeEmitter = new TypeEmitter(stringEmitter);
    }

    emitClasses(classes: CSharpClass[], options?: ClassEmitOptions) {
        for (var classObject of classes) {
            this.emitClass(classObject, options);
		}

		this.stringEmitter.removeLastNewLines();
    }

	emitClass(classObject: CSharpClass, options?: ClassEmitOptions) {
		options = Object.assign(
			this.prepareOptions(options),
			options.perClassEmitOptions(classObject));

		this.emitClassInterface(classObject, options);
		this.emitEnumsAndSubclassesInClass(classObject, options);

		this.stringEmitter.ensureLineSplit();
	}

	private prepareOptions(options?: ClassEmitOptions) {
		if (!options) {
			options = {
				declare: true
			}
		}

		if (!options.perClassEmitOptions) {
			options.perClassEmitOptions = () => options;
		}

		return options;
	}

    private emitClassInterface(classObject: CSharpClass, options?: ClassEmitOptions & PerClassEmitOptions) {
		if (classObject.properties.length === 0 && classObject.methods.length === 0 && classObject.fields.length === 0) {
			console.log("Skipping interface " + classObject.name + " because it contains no properties, fields or methods");
            return;
		}
        
        this.stringEmitter.writeIndentation();
        if (options.declare)
			this.stringEmitter.write("declare ");

		var className = options.name || classObject.name;
		console.log("Emitting interface " + className);

		this.stringEmitter.write("interface " + className);

		if (classObject.inheritsFrom) {
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
			this.stringEmitter.ensureLineSplit();
		}

		if (classObject.properties.length > 0) {
			this.propertyEmitter.emitProperties(classObject.properties, options.propertyEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (classObject.methods.length > 0) {
			this.methodEmitter.emitMethods(classObject.methods, options.methodEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		this.stringEmitter.removeLastNewLines();

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
		this.stringEmitter.writeLine("}");
	}

	private emitEnumsAndSubclassesInClass(classObject: CSharpClass, options?: ClassEmitOptions) {
		if (classObject.enums.length === 0 && classObject.classes.length === 0) {
            return;
        }

        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");

        this.stringEmitter.write("namespace " + classObject.name + " {");
        this.stringEmitter.writeLine();

        this.stringEmitter.increaseIndentation();

		var classEnumOptions = Object.assign(
			options.enumEmitOptions || {},
			<EnumEmitOptions>{
			    declare: false
		    });
        this.enumEmitter.emitEnums(
            classObject.enums,
			classEnumOptions);

		this.stringEmitter.writeLine();

		var subClassOptions = Object.assign(options, <ClassEmitOptions>{
			declare: false
		});
        this.emitClasses(
            classObject.classes,
			subClassOptions);

        this.stringEmitter.removeLastCharacters("\n");
		this.stringEmitter.removeLastCharacters("\n");

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    }
}