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

	write(text: string) {
		this._output += text;
	}

	increaseIndentation() {
		this.indentationLevel++;
	}

	decreaseIndentation() {
		this.indentationLevel--;
	}

	removeLastCharacters(characters: string) {
		if (this._output.substr(this._output.length - characters.length) !== characters)
			return false;

		while (this.removeLastCharacters(this.indentation)) { }
		this._output = this._output.substr(0, this._output.length - characters.length);
		while (this.removeLastCharacters(this.indentation)) { }

		return true;
	}

	get output() {
		return this._output.trim();
	}

	writeIndentation() {
		for (var i = 0; i < this.indentationLevel; i++) {
			this._output += this.indentation;
		}
	}
}