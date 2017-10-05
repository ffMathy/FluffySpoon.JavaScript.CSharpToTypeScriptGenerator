import { FileParser, CSharpEnum, CSharpEnumOption, CSharpFile } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { OptionsHelper } from './OptionsHelper';
import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitter, InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitter, NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { Logger } from './Logger';
 
export interface FileEmitOptions {
	classEmitOptions?: ClassEmitOptions,
	namespaceEmitOptions?: NamespaceEmitOptions,
    enumEmitOptions?: EnumEmitOptions,
    structEmitOptions?: StructEmitOptions,
	interfaceEmitOptions?: InterfaceEmitOptions,
	typeEmitOptions?: TypeEmitOptions,
	propertyEmitOptions?: PropertyEmitOptions,
	methodEmitOptions?: MethodEmitOptions,

	afterParsing?: (file: CSharpFile) => void
}

export class FileEmitter {
	public readonly stringEmitter: StringEmitter;
	public readonly logger: Logger;

    private fileParser: FileParser;
    private enumEmitter: EnumEmitter;
    private classEmitter: ClassEmitter;
    private interfaceEmitter: InterfaceEmitter;
    private namespaceEmitter: NamespaceEmitter;
    private structEmitter: StructEmitter;
	private optionsHelper: OptionsHelper;

    constructor(content: string) {
		this.fileParser = new FileParser(content);

		this.logger = new Logger();
		this.optionsHelper = new OptionsHelper();

		this.stringEmitter = new StringEmitter(this.logger);

        this.enumEmitter = new EnumEmitter(this.stringEmitter, this.logger);
        this.classEmitter = new ClassEmitter(this.stringEmitter, this.logger);
        this.interfaceEmitter = new InterfaceEmitter(this.stringEmitter, this.logger);
        this.namespaceEmitter = new NamespaceEmitter(this.stringEmitter, this.logger);
        this.structEmitter = new StructEmitter(this.stringEmitter, this.logger);
    }

	emitFile(options?: FileEmitOptions) {

		this.logger.log("Emitting file.", options);

		if (!options) {
			options = {};
		}

		if(!options.classEmitOptions) options.classEmitOptions = {};
		if(!options.enumEmitOptions) options.enumEmitOptions = {};
		if(!options.interfaceEmitOptions) options.interfaceEmitOptions = {};
		if(!options.namespaceEmitOptions) options.namespaceEmitOptions = {};
		if(!options.structEmitOptions) options.structEmitOptions = {};
		if(!options.typeEmitOptions) options.typeEmitOptions = {};
		if(!options.methodEmitOptions) options.methodEmitOptions = {};
		if(!options.propertyEmitOptions) options.propertyEmitOptions = {};

		if (options.classEmitOptions) {
			if(options.namespaceEmitOptions) {
				options.namespaceEmitOptions.classEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.classEmitOptions,
						options.namespaceEmitOptions.classEmitOptions);
			}
		}

		if (options.interfaceEmitOptions) {
			if(options.namespaceEmitOptions) {
				options.namespaceEmitOptions.interfaceEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.interfaceEmitOptions,
						options.namespaceEmitOptions.interfaceEmitOptions);
			}
			if (options.classEmitOptions) {
				options.classEmitOptions.interfaceEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.interfaceEmitOptions,
						options.classEmitOptions.interfaceEmitOptions);
			}
		}

		if (options.enumEmitOptions) {
			if (options.classEmitOptions) {
				options.classEmitOptions.enumEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.enumEmitOptions,
						options.classEmitOptions.enumEmitOptions);
			}
			if (options.namespaceEmitOptions) {
				options.namespaceEmitOptions.enumEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.enumEmitOptions,
						options.namespaceEmitOptions.enumEmitOptions);
			}
		}

		if(options.structEmitOptions) {
			if(options.namespaceEmitOptions) {
				options.namespaceEmitOptions.structEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.structEmitOptions,
						options.namespaceEmitOptions.structEmitOptions);
			}
		}

		if(options.methodEmitOptions) {
			if(options.classEmitOptions) {
				options.classEmitOptions.methodEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.classEmitOptions,
						options.classEmitOptions.methodEmitOptions);
			}

			if(options.interfaceEmitOptions) {
				options.interfaceEmitOptions.methodEmitOptions =  
					this.optionsHelper.mergeOptions(
						options.interfaceEmitOptions,
						options.interfaceEmitOptions.methodEmitOptions);
			}
		}

		if(options.propertyEmitOptions) {
			if(options.classEmitOptions) {
				options.classEmitOptions.propertyEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.classEmitOptions,
						options.classEmitOptions.propertyEmitOptions);
			}

			if(options.interfaceEmitOptions) {
				options.interfaceEmitOptions.propertyEmitOptions =  
					this.optionsHelper.mergeOptions(
						options.interfaceEmitOptions,
						options.interfaceEmitOptions.propertyEmitOptions);
			}
		}

		if(options.typeEmitOptions) {
			if(options.classEmitOptions) {
				options.classEmitOptions.genericParameterTypeEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.typeEmitOptions,
						options.classEmitOptions.genericParameterTypeEmitOptions);
						
				options.classEmitOptions.inheritedTypeEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.typeEmitOptions,
						options.classEmitOptions.inheritedTypeEmitOptions);

				if(options.classEmitOptions.fieldEmitOptions) {
					options.classEmitOptions.fieldEmitOptions.typeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.classEmitOptions.fieldEmitOptions.typeEmitOptions);
				}

				if(options.classEmitOptions.methodEmitOptions) {
					options.classEmitOptions.methodEmitOptions.argumentTypeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.classEmitOptions.methodEmitOptions.argumentTypeEmitOptions);
							
					options.classEmitOptions.methodEmitOptions.returnTypeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.classEmitOptions.methodEmitOptions.returnTypeEmitOptions);
				}

				if(options.classEmitOptions.propertyEmitOptions) {
					options.classEmitOptions.propertyEmitOptions.typeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.classEmitOptions.propertyEmitOptions.typeEmitOptions);
				}
			}
			
			if(options.interfaceEmitOptions) {
				options.interfaceEmitOptions.genericParameterTypeEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.typeEmitOptions,
						options.interfaceEmitOptions.genericParameterTypeEmitOptions);
						
				options.interfaceEmitOptions.inheritedTypeEmitOptions = 
					this.optionsHelper.mergeOptions(
						options.typeEmitOptions,
						options.interfaceEmitOptions.inheritedTypeEmitOptions);

				if(options.interfaceEmitOptions.methodEmitOptions) {
					options.interfaceEmitOptions.methodEmitOptions.argumentTypeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.interfaceEmitOptions.methodEmitOptions.argumentTypeEmitOptions);
							
					options.interfaceEmitOptions.methodEmitOptions.returnTypeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.interfaceEmitOptions.methodEmitOptions.returnTypeEmitOptions);
				}

				if(options.interfaceEmitOptions.propertyEmitOptions) {
					options.interfaceEmitOptions.propertyEmitOptions.typeEmitOptions = 
						this.optionsHelper.mergeOptions(
							options.typeEmitOptions,
							options.interfaceEmitOptions.propertyEmitOptions.typeEmitOptions);
				}
			}
		}

		this.logger.log("Using options", options);

		var file = this.fileParser.parseFile();
		if(options.afterParsing)
			options.afterParsing(file);

		if (file.enums.length > 0) {
			this.enumEmitter.emitEnums(file.enums, Object.assign({ declare: true }, options.enumEmitOptions));
			this.stringEmitter.ensureNewParagraph();
		}

		if (file.namespaces.length > 0) {
			this.namespaceEmitter.emitNamespaces(
				file.namespaces, 
				Object.assign({ declare: true }, options.namespaceEmitOptions));
			this.stringEmitter.ensureNewParagraph();
		}

		if (file.interfaces.length > 0) {
			this.interfaceEmitter.emitInterfaces(
				file.interfaces, 
				Object.assign({ declare: true }, options.interfaceEmitOptions));
			this.stringEmitter.ensureNewParagraph();
        }

		if (file.classes.length > 0) {
			this.classEmitter.emitClasses(
				file.classes, 
				Object.assign({ declare: true }, options.classEmitOptions));
			this.stringEmitter.ensureNewParagraph();
        }

        if (file.structs.length > 0) {
            this.structEmitter.emitStructs(
				file.structs, 
				Object.assign({ declare: true }, options.structEmitOptions));
            this.stringEmitter.ensureNewParagraph();
        }

		this.stringEmitter.removeLastNewLines();

        return this.stringEmitter.output;
    }
}