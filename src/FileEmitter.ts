import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitter, StructEmitOptions } from './StructEmitter';
import { EnumEmitter, EnumEmitOptions } from './EnumEmitter';
import { ClassEmitter, ClassEmitOptions } from './ClassEmitter';
import { NamespaceEmitter, NamespaceEmitOptions } from './NamespaceEmitter';
import { Logger } from './Logger';
 
export interface FileEmitOptions {
	classEmitOptions?: ClassEmitOptions,
	namespaceEmitOptions?: NamespaceEmitOptions,
    enumEmitOptions?: EnumEmitOptions,
    structEmitOptions?: StructEmitOptions
}

export class FileEmitter {
	public readonly stringEmitter: StringEmitter;
	public readonly logger: Logger;

    private fileParser: FileParser;
    private enumEmitter: EnumEmitter;
    private classEmitter: ClassEmitter;
    private namespaceEmitter: NamespaceEmitter;
    private structEmitter: StructEmitter;

    constructor(content: string) {
		this.fileParser = new FileParser(content);

		this.logger = new Logger();

		this.stringEmitter = new StringEmitter(this.logger);

        this.enumEmitter = new EnumEmitter(this.stringEmitter, this.logger);
        this.classEmitter = new ClassEmitter(this.stringEmitter, this.logger);
        this.namespaceEmitter = new NamespaceEmitter(this.stringEmitter, this.logger);
        this.structEmitter = new StructEmitter(this.stringEmitter, this.logger);
    }

	emitFile(options?: FileEmitOptions) {

		this.logger.log("Emitting file.");

		if (!options) {
			options = {};
		}

		if (options.classEmitOptions && options.namespaceEmitOptions) {
			options.namespaceEmitOptions.classEmitOptions = options.classEmitOptions;
		}

		if (options.enumEmitOptions) {
			if (options.classEmitOptions) {
				options.classEmitOptions.enumEmitOptions = options.enumEmitOptions;
			}
			if (options.namespaceEmitOptions) {
				options.namespaceEmitOptions.enumEmitOptions = options.enumEmitOptions;
			}
		}

		var file = this.fileParser.parseFile();

		if (file.enums.length > 0) {
			this.enumEmitter.emitEnums(file.enums, options.enumEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (file.namespaces.length > 0) {
			this.namespaceEmitter.emitNamespaces(file.namespaces, options.namespaceEmitOptions);
			this.stringEmitter.ensureLineSplit();
		}

		if (file.classes.length > 0) {
			this.classEmitter.emitClasses(file.classes, options.classEmitOptions);
			this.stringEmitter.ensureLineSplit();
        }

        if (file.structs.length > 0) {
            this.structEmitter.emitStructs(file.structs, options.structEmitOptions);
            this.stringEmitter.ensureLineSplit();
        }

		this.stringEmitter.removeLastNewLines();

        return this.stringEmitter.output;
    }
}