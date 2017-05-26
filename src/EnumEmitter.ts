import { FileParser, CSharpEnum, CSharpEnumOption } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';

export interface EnumEmitOptions {
	declare: boolean;
	strategy?: "default" | "string-union";
}

export class EnumEmitter {
    constructor(
        private stringEmitter: StringEmitter) {

	}

	private prepareOptions(options?: EnumEmitOptions) {
		if (!options) {
			options = {
				declare: true,
				strategy: "default"
			}
		}
        
		if (!options.strategy) {
			options.strategy = "default";
		}

		return options;
	}

	emitEnums(enums: CSharpEnum[], options?: EnumEmitOptions) {
        for (var enumObject of enums) {
            this.emitEnum(enumObject, options);
		}

		this.stringEmitter.removeLastCharacters("\n");

		if (options.strategy === "default") {
			this.stringEmitter.removeLastCharacters("}");
		}
    }

	emitEnum(enumObject: CSharpEnum, options?: EnumEmitOptions) {
		options = this.prepareOptions(options);

        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");

		if (options.strategy === "default") {
			this.stringEmitter.write("enum");
		} else if (options.strategy === "string-union") {
			this.stringEmitter.write("type");
		}

		this.stringEmitter.write(" " + enumObject.name + " ");

		if (options.strategy === "default") {
			this.stringEmitter.write("{");
		} else if (options.strategy === "string-union") {
			this.stringEmitter.write("=");
		}

        this.stringEmitter.writeLine();
        this.stringEmitter.increaseIndentation();

        for (var option of enumObject.options)
            this.emitEnumOption(option, options);

		this.stringEmitter.removeLastCharacters('\n');

		if (options.strategy === "default") {
			this.stringEmitter.removeLastCharacters(',');
		} else if (options.strategy === "string-union") {
			this.stringEmitter.removeLastCharacters(' |');
		}

        this.stringEmitter.decreaseIndentation();
		this.stringEmitter.writeLine();

		if (options.strategy === "default") {
			this.stringEmitter.writeLine("}");
			this.stringEmitter.writeLine();
		}
    }

	private emitEnumOption(
		option: CSharpEnumOption,
		options: EnumEmitOptions)
	{
		if (options.strategy === "default") {
			this.stringEmitter.writeLine(option.name + " = " + option.value + ",");
		} else if (options.strategy === "string-union") {
			this.stringEmitter.writeLine("'" + option.name + "' |");
		}
    }
}