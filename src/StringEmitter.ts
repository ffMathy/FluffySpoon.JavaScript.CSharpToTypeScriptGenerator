export class StringEmitter {
	private _output: string;
	private indentationLevel: number;
	private indentation: string;

	constructor() {
		this._output = '';
		this.indentationLevel = 0;
		this.indentation = '    ';
	}

	writeLine(line?: string) {
		if (line) {
			this.writeIndentation();
			this.write(line);
		}

		this.write("\n");
	}

	private getLogText(text: string) {
		var logText = text
			.replace("\n", "\\n")
			.replace("\t", "\\t")
			.replace("\r", "\\r")
			.trim();
		return logText;
	}

	write(text: string) {
		this._output += text;

		var logged = this.getLogText(text);
		console.log("Emitted: " + logged);
	}

	increaseIndentation() {
		this.indentationLevel++;
		console.log("Increased indentation to " + this.indentationLevel);
	}

	decreaseIndentation() {
		this.indentationLevel--;
		console.log("Decreased indentation to " + this.indentationLevel);
	}

	removeLastNewLines() {
		console.log("Removing last lines.");
		while (this.removeLastCharacters("\n"));
	}

	ensureNewLine() {
		this.removeLastNewLines();
		this.writeLine();
	}

	ensureLineSplit() {
		this.ensureNewLine();
		this.writeLine();
	}

	removeLastCharacters(characters: string) {
		if (this._output.substr(this._output.length - characters.length) !== characters)
			return false;

		for (var character of characters) {
			while (this.removeLastCharacters(this.indentation));
			this._output = this._output.substr(0, this._output.length - character.length);
			while (this.removeLastCharacters(this.indentation));
		}

		return true;
	}

	get currentIndentation() {
		var indentation = "";
		for (var i = 0; i < this.indentationLevel; i++) {
			indentation += this.indentation;
		}

		return indentation;
	}

	get output() {
		return this._output.trim();
	}

	writeIndentation() {
		this._output += this.currentIndentation;
	}
}