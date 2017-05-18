export class StringEmitter {
    private _output: string;
    private indentation: number;

    constructor() {
        this._output = '';
        this.indentation = 0;
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
        this.indentation++;
    }

    decreaseIndentation() {
        this.indentation--;
    }

    removeLastCharacters(characters: string) {
        if (this._output.substr(this._output.length - characters.length, characters.length) !== characters)
            return;

        this._output = this._output.substr(0, this._output.length - characters.length);
    }

    get output() {
        return this._output;
    }

    writeIndentation() {
        for (var i = 0; i < this.indentation; i++) {
            this._output += "    ";
        }
    }
}