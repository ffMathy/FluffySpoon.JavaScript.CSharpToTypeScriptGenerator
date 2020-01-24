import { FileParser, CSharpEnum, CSharpEnumOption, CSharpFile } from '@fluffy-spoon/csharp-parser';

import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitOptions, TypeEmitOptionsBase } from './TypeEmitter';
import { StructEmitter, StructEmitOptions, StructEmitOptionsBase } from './StructEmitter';
import { FileEmitter, FileEmitOptions } from './FileEmitter';
import { EnumEmitter, EnumEmitOptions, EnumEmitOptionsBase } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions, ClassEmitOptionsBase } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions, InterfaceEmitOptionsBase } from './InterfaceEmitter';
import { NamespaceEmitter, NamespaceEmitOptions, NamespaceEmitOptionsBase } from './NamespaceEmitter';
import { MethodEmitOptions, MethodEmitOptionsBase, PerMethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions, PerPropertyEmitOptions, PropertyEmitOptionsBase } from './PropertyEmitter';
import { FieldEmitOptions, FieldEmitOptionsBase } from './FieldEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { OptionsHelper } from './OptionsHelper';

export interface NestingLevelMixin {
	nestingLevel: number;
}

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
	file?: FileEmitOptions
}

export class Emitter {
	public readonly typeScriptEmitter: TypeScriptEmitter;
	public readonly logger: Logger;

	private fileEmitter: FileEmitter;
	private optionsHelper: OptionsHelper;

	constructor(content: string) {
		this.logger = new Logger();
		this.typeScriptEmitter = new TypeScriptEmitter(this.logger);

		this.fileEmitter = new FileEmitter(content, this.typeScriptEmitter, this.logger);
		this.optionsHelper = new OptionsHelper();
	}

	emit(options?: EmitOptions) {
		if(!options)
			options = {};

		this.logger.log("Emitting file.");

		options.defaults = this.prepareEmitOptionDefaults(options.defaults);

		if(!options.file) options.file = {};

		this.mergeFileEmitOptions(options.file, options.defaults);

		return this.fileEmitter.emitFile(options.file);
	}

	private mergeFileEmitOptions(
		explicitSettings: FileEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		if(!explicitSettings.classEmitOptions) explicitSettings.classEmitOptions = {};
		if(!explicitSettings.enumEmitOptions) explicitSettings.enumEmitOptions = {};
		if(!explicitSettings.interfaceEmitOptions) explicitSettings.interfaceEmitOptions = {};
		if(!explicitSettings.namespaceEmitOptions) explicitSettings.namespaceEmitOptions = {};
		if(!explicitSettings.structEmitOptions) explicitSettings.structEmitOptions = {};

		this.mergeClassEmitOptions(explicitSettings.classEmitOptions, defaultSettings);
		this.mergeEnumEmitOptions(explicitSettings.enumEmitOptions, defaultSettings);
		this.mergeInterfaceEmitOptions(explicitSettings.interfaceEmitOptions, defaultSettings);
		this.mergeNamespaceEmitOptions(explicitSettings.namespaceEmitOptions, defaultSettings);
		this.mergeStructEmitOptions(explicitSettings.structEmitOptions, defaultSettings);
	}

	private mergeNamespaceEmitOptions(
		explicitSettings: NamespaceEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.namespaceEmitOptions);

		if(!explicitSettings.classEmitOptions) explicitSettings.classEmitOptions = {};
		if(!explicitSettings.enumEmitOptions) explicitSettings.enumEmitOptions = {};
		if(!explicitSettings.interfaceEmitOptions) explicitSettings.interfaceEmitOptions = {};
		if(!explicitSettings.structEmitOptions) explicitSettings.structEmitOptions = {};

		this.mergeClassEmitOptions(explicitSettings.classEmitOptions, defaultSettings);
		this.mergeEnumEmitOptions(explicitSettings.enumEmitOptions, defaultSettings);
		this.mergeInterfaceEmitOptions(explicitSettings.interfaceEmitOptions, defaultSettings);
		this.mergeStructEmitOptions(explicitSettings.structEmitOptions, defaultSettings);
	}

	private mergeClassEmitOptions(
		explicitSettings: ClassEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.classEmitOptions);

		if(!explicitSettings.enumEmitOptions) explicitSettings.enumEmitOptions = {};
		if(!explicitSettings.fieldEmitOptions) explicitSettings.fieldEmitOptions = {};
		if(!explicitSettings.genericParameterTypeEmitOptions) explicitSettings.genericParameterTypeEmitOptions = {};
		if(!explicitSettings.inheritedTypeEmitOptions) explicitSettings.inheritedTypeEmitOptions = {};
		if(!explicitSettings.interfaceEmitOptions) explicitSettings.interfaceEmitOptions = {};
		if(!explicitSettings.methodEmitOptions) explicitSettings.methodEmitOptions = {};
		if(!explicitSettings.propertyEmitOptions) explicitSettings.propertyEmitOptions = {};
		if(!explicitSettings.structEmitOptions) explicitSettings.structEmitOptions = {};

		this.mergeEnumEmitOptions(explicitSettings.enumEmitOptions, defaultSettings);
		this.mergeFieldEmitOptions(explicitSettings.fieldEmitOptions, defaultSettings);
		this.mergeTypeEmitOptions(explicitSettings.genericParameterTypeEmitOptions, defaultSettings);
		this.mergeTypeEmitOptions(explicitSettings.inheritedTypeEmitOptions, defaultSettings);
		this.mergeInterfaceEmitOptions(explicitSettings.interfaceEmitOptions, defaultSettings);
		this.mergeMethodEmitOptions(explicitSettings.methodEmitOptions, defaultSettings);
		this.mergePropertyEmitOptions(explicitSettings.propertyEmitOptions, defaultSettings);
		this.mergeStructEmitOptions(explicitSettings.structEmitOptions, defaultSettings);
	}

	private mergeEnumEmitOptions(
		explicitSettings: EnumEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.enumEmitOptions);
	}

	private mergeFieldEmitOptions(
		explicitSettings: FieldEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.fieldEmitOptions);

		if(!explicitSettings.typeEmitOptions) explicitSettings.typeEmitOptions = {};

		this.mergeTypeEmitOptions(explicitSettings.typeEmitOptions, defaultSettings);
	}

	private mergeTypeEmitOptions(
		explicitSettings: TypeEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.typeEmitOptions);
	}

	private mergeInterfaceEmitOptions(
		explicitSettings: InterfaceEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.interfaceEmitOptions);

		if(!explicitSettings.genericParameterTypeEmitOptions) explicitSettings.genericParameterTypeEmitOptions = {};
		if(!explicitSettings.inheritedTypeEmitOptions) explicitSettings.inheritedTypeEmitOptions = {};
		if(!explicitSettings.methodEmitOptions) explicitSettings.methodEmitOptions = {};
		if(!explicitSettings.propertyEmitOptions) explicitSettings.propertyEmitOptions = {};

		this.mergeTypeEmitOptions(explicitSettings.genericParameterTypeEmitOptions, defaultSettings);
		this.mergeTypeEmitOptions(explicitSettings.inheritedTypeEmitOptions, defaultSettings);
		this.mergeMethodEmitOptions(explicitSettings.methodEmitOptions, defaultSettings);
		this.mergePropertyEmitOptions(explicitSettings.propertyEmitOptions, defaultSettings);
	}

	private mergeMethodEmitOptions(
		explicitSettings: MethodEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.methodEmitOptions);

		if(!explicitSettings.argumentTypeEmitOptions) explicitSettings.argumentTypeEmitOptions = {};
		if(!explicitSettings.returnTypeEmitOptions) explicitSettings.returnTypeEmitOptions = {};

		this.mergeTypeEmitOptions(explicitSettings.argumentTypeEmitOptions, defaultSettings);
		this.mergeTypeEmitOptions(explicitSettings.returnTypeEmitOptions, defaultSettings);
	}

	private mergePropertyEmitOptions(
		explicitSettings: PropertyEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.propertyEmitOptions);

		if(!explicitSettings.typeEmitOptions) explicitSettings.typeEmitOptions = {};

		this.mergeTypeEmitOptions(explicitSettings.typeEmitOptions, defaultSettings);
	}

	private mergeStructEmitOptions(
		explicitSettings: StructEmitOptions, 
		defaultSettings: DefaultEmitOptions) 
	{
		this.optionsHelper.mergeOptions(explicitSettings, defaultSettings.structEmitOptions);
		
		if(!explicitSettings.fieldEmitOptions) explicitSettings.fieldEmitOptions = {};
		if(!explicitSettings.methodEmitOptions) explicitSettings.methodEmitOptions = {};
		if(!explicitSettings.propertyEmitOptions) explicitSettings.propertyEmitOptions = {};

		this.mergeFieldEmitOptions(explicitSettings.fieldEmitOptions, defaultSettings);
		this.mergeMethodEmitOptions(explicitSettings.methodEmitOptions, defaultSettings);
		this.mergePropertyEmitOptions(explicitSettings.propertyEmitOptions, defaultSettings);
	}

	private prepareEnumEmitOptionDefaults(options: EnumEmitOptions) {
		if (!options.filter)
			options.filter = (enumObject) => !!enumObject.isPublic;

		if (!options.strategy) {
			options.strategy = "default";
		}

		if (!options.useConst) {
			options.useConst = false;
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
			options.perMethodEmitOptions = (method) => <PerMethodEmitOptions>{
				name: method.name.charAt(0).toLowerCase() + method.name.substring(1)
			};
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
