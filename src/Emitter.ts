import { FileParser, CSharpEnum, CSharpEnumOption, CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions, TypeEmitOptionsBase } from './TypeEmitter';
import { StructEmitter, StructEmitOptions, StructEmitOptionsBase } from './StructEmitter';
import { FileEmitter, FileEmitOptions } from './FileEmitter';
import { EnumEmitter, EnumEmitOptions, EnumEmitOptionsBase } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions, ClassEmitOptionsBase } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions, InterfaceEmitOptionsBase } from './InterfaceEmitter';
import { NamespaceEmitter, NamespaceEmitOptions, NamespaceEmitOptionsBase } from './NamespaceEmitter';
import { MethodEmitOptions, MethodEmitOptionsBase } from './MethodEmitter';
import { PropertyEmitOptions, PerPropertyEmitOptions, PropertyEmitOptionsBase } from './PropertyEmitter';
import { FieldEmitOptions, FieldEmitOptionsBase } from './FieldEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface DefaultEmitOptions {
	classEmitOptions?: ClassEmitOptionsBase,
	namespaceEmitOptions?: NamespaceEmitOptionsBase,
	enumEmitOptions?: EnumEmitOptionsBase,
	structEmitOptions?: StructEmitOptionsBase,
	interfaceEmitOptions?: InterfaceEmitOptionsBase,
	typeEmitOptions?: TypeEmitOptionsBase,
	propertyEmitOptions?: PropertyEmitOptionsBase,
	fieldEmitOptions?: FieldEmitOptionsBase,
	methodEmitOptions?: MethodEmitOptionsBase,
}

export interface EmitOptions {
	defaults?: DefaultEmitOptions,
	file?: FileEmitOptions,
	onAfterParsing?: (file: CSharpFile, fileEmitter: StringEmitter) => void
}

export class Emitter {
	public readonly stringEmitter: StringEmitter;
	public readonly logger: Logger;

	private fileEmitter: FileEmitter;

	constructor(content: string) {
		this.logger = new Logger();
		this.stringEmitter = new StringEmitter(this.logger);

		this.fileEmitter = new FileEmitter(this.logger, this.stringEmitter, content);
	}

	emit(options?: EmitOptions) {
		if(!options)
			options = {};

		this.logger.log("Emitting file.");

		options.defaults = this.prepareEmitOptionDefaults(options.defaults);

		if(!options.file) options.file = {};

		this.mergeOptions({}, options.file.enumEmitOptions, options.defaults.enumEmitOptions);
		this.mergeOptions({}, options.file.classEmitOptions, options.defaults.classEmitOptions);
		this.mergeOptions({}, options.file.interfaceEmitOptions, options.defaults.interfaceEmitOptions);
		this.mergeOptions({}, options.file.namespaceEmitOptions, options.defaults.namespaceEmitOptions);
		this.mergeOptions({}, options.file.structEmitOptions, options.defaults.structEmitOptions);


		return this.fileEmitter.emitFile(options.file);
	}

	private mergeFileEmitOptions(
		fromSettings: FileEmitOptions, 
		toSettings: FileEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.mergeOptions(fromSettings.enumEmitOptions, toSettings.enumEmitOptions, defaultSettings.enumEmitOptions);

		this.mergeClassEmitOptions(
			fromSettings.classEmitOptions, 
			toSettings.classEmitOptions, 
			defaultSettings);
		this.mergeInterfaceEmitOptions(
			fromSettings.interfaceEmitOptions, 
			toSettings.interfaceEmitOptions, 
			defaultSettings);
		this.mergeNamespaceEmitOptions(
			fromSettings.namespaceEmitOptions, 
			toSettings.namespaceEmitOptions, 
			defaultSettings);
		this.mergeStructEmitOptions(
			fromSettings.structEmitOptions, 
			toSettings.structEmitOptions, 
			defaultSettings);
	}

	private mergeClassEmitOptions(
		fromSettings: ClassEmitOptions, 
		toSettings: ClassEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.mergeOptions(fromSettings, toSettings, defaultSettings.classEmitOptions);
		this.mergeOptions(fromSettings.enumEmitOptions, toSettings.enumEmitOptions, defaultSettings.enumEmitOptions);
		this.mergeOptions(fromSettings.fieldEmitOptions, toSettings.fieldEmitOptions, defaultSettings.fieldEmitOptions);
		this.mergeOptions(fromSettings.fieldEmitOptions, toSettings.fieldEmitOptions, defaultSettings.fieldEmitOptions);
	}

	private mergeMethodEmitOptions(
		fromSettings: MethodEmitOptions, 
		toSettings: MethodEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.mergeOptions(fromSettings, toSettings, defaultSettings.methodEmitOptions);
		this.mergeOptions(fromSettings.returnTypeEmitOptions, toSettings.returnTypeEmitOptions, defaultSettings.typeEmitOptions);
	}

	private mergeOptions<T>(fromSettings: T, toSettings: T, defaultSettings: T): T {
		if(!toSettings)
			toSettings = <T>{};

		const properties = Object.getOwnPropertyNames(defaultSettings);
		for(var propertyName of properties) {
			const typeName = typeof defaultSettings[propertyName];
			if(typeName === "function" || typeName === "object")
				continue;

			if(!(propertyName in toSettings))
				toSettings[propertyName] = fromSettings[propertyName] || defaultSettings[propertyName];
		}

		return toSettings;
	}

	private prepareEnumEmitOptionDefaults(options: EnumEmitOptions) {
		if (!options.filter)
			options.filter = (enumObject) => !!enumObject.isPublic;

		if (!options.strategy) {
			options.strategy = "default";
		}

		return options;
	}

	private prepareTypeEmitOptionDefaults(options: TypeEmitOptions) {
		if (!options.filter) {
			options.filter = (type) => true;
		}

		return options;
	}

	private prepareFieldEmitOptionDefaults(options: FieldEmitOptions) {
		if (!options.typeEmitOptions) options.typeEmitOptions = {};

		if (!options.filter) {
			options.filter = (field) => !!field.isPublic;
		}

		if (!options.perFieldEmitOptions) {
			options.perFieldEmitOptions = () => options;
		}

		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		return options;
	}

	private preparePropertyEmitOptionDefaults(options: PropertyEmitOptions) {
		if (!options.typeEmitOptions) options.typeEmitOptions = {};

		if (!options.filter) {
			options.filter = (property) => !!property.isPublic;
		}

		if (!options.perPropertyEmitOptions) {
			options.perPropertyEmitOptions = (property) => <PerPropertyEmitOptions>{
				name: property.name.charAt(0).toLowerCase() + property.name.substring(1)
			};
		}

		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);

		return options;
	}

	private prepareStructEmitOptionDefaults(options: StructEmitOptions) {
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if (!options.fieldEmitOptions) options.fieldEmitOptions = {};

		if (!options.filter) {
			options.filter = (struct) => !!struct.isPublic;
		}

		if (!options.perStructEmitOptions) {
			options.perStructEmitOptions = () => options;
		}

		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);

		return options;
	}

	private prepareMethodEmitOptionDefaults(options: MethodEmitOptions) {
		if (!options.argumentTypeEmitOptions) options.argumentTypeEmitOptions = {};
		if (!options.returnTypeEmitOptions) options.returnTypeEmitOptions = {};

		if (!options.filter) {
			options.filter = (method) => !!method.isPublic;
		}

		if (!options.perMethodEmitOptions) {
			options.perMethodEmitOptions = () => options;
		}

		options.argumentTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.argumentTypeEmitOptions);
		options.returnTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.returnTypeEmitOptions);

		return options;
	}

	private prepareInterfaceEmitOptionDefaults(options: InterfaceEmitOptions) {
		if (!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if (!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};

		if (!options.filter) {
			options.filter = (interfaceObject) => !!interfaceObject.isPublic;
		}

		if (!options.perInterfaceEmitOptions) {
			options.perInterfaceEmitOptions = () => options;
		}

		options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
		options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);

		return options;
	}

	private prepareNamespaceEmitOptionDefaults(options: NamespaceEmitOptions) {
		if (!options.enumEmitOptions) options.enumEmitOptions = {};
		if (!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if (!options.structEmitOptions) options.structEmitOptions = {};
		if (!options.classEmitOptions) options.classEmitOptions = {};

		if (!options.filter) {
			options.filter = (namespace) => true;
		}

		options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
		options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
		options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
		options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);

		return options;
	}

	private prepareClassEmitOptionDefaults(options: ClassEmitOptions) {
		if (!options.enumEmitOptions) options.enumEmitOptions = {};
		if (!options.fieldEmitOptions) options.fieldEmitOptions = {};
		if (!options.genericParameterTypeEmitOptions) options.genericParameterTypeEmitOptions = {};
		if (!options.inheritedTypeEmitOptions) options.inheritedTypeEmitOptions = {};
		if (!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if (!options.structEmitOptions) options.structEmitOptions = {};

		if (!options.filter)
			options.filter = (classObject) => !!classObject.isPublic;

		if (!options.perClassEmitOptions)
			options.perClassEmitOptions = () => <Object>{};

		options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);
		options.genericParameterTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.genericParameterTypeEmitOptions);
		options.inheritedTypeEmitOptions = this.prepareTypeEmitOptionDefaults(options.inheritedTypeEmitOptions);
		options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);

		return options;
	}

	private prepareEmitOptionDefaults(options: DefaultEmitOptions) {
		if(!options) options = {};

		if (!options.classEmitOptions) options.classEmitOptions = {};
		if (!options.enumEmitOptions) options.enumEmitOptions = {};
		if (!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if (!options.namespaceEmitOptions) options.namespaceEmitOptions = {};
		if (!options.structEmitOptions) options.structEmitOptions = {};
		if (!options.typeEmitOptions) options.typeEmitOptions = {};
		if (!options.methodEmitOptions) options.methodEmitOptions = {};
		if (!options.propertyEmitOptions) options.propertyEmitOptions = {};
		if (!options.fieldEmitOptions) options.fieldEmitOptions = {};

		options.classEmitOptions = this.prepareClassEmitOptionDefaults(options.classEmitOptions);
		options.enumEmitOptions = this.prepareEnumEmitOptionDefaults(options.enumEmitOptions);
		options.interfaceEmitOptions = this.prepareInterfaceEmitOptionDefaults(options.interfaceEmitOptions);
		options.namespaceEmitOptions = this.prepareNamespaceEmitOptionDefaults(options.namespaceEmitOptions);
		options.structEmitOptions = this.prepareStructEmitOptionDefaults(options.structEmitOptions);
		options.typeEmitOptions = this.prepareTypeEmitOptionDefaults(options.typeEmitOptions);
		options.methodEmitOptions = this.prepareMethodEmitOptionDefaults(options.methodEmitOptions);
		options.propertyEmitOptions = this.preparePropertyEmitOptionDefaults(options.propertyEmitOptions);
		options.fieldEmitOptions = this.prepareFieldEmitOptionDefaults(options.fieldEmitOptions);

		return options;
	}
}
