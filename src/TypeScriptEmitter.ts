import { Logger } from './Logger';

import ts = require("typescript");

export class TypeScriptEmitter {
	private _output: string;

	private indentationLevel: number;
	private indentation: string;

	private readonly NEWLINE_CHARACTER = "\n";

	constructor(private logger?: Logger) {
		if(!this.logger) 
			this.logger = new Logger();
		
		this._output = '';
		this.indentationLevel = 0;
		this.indentation = '    ';
	}

	clear() {
		this._output = '';
	}

	enterScope(scopeText: string) {
		this.writeLine(scopeText);
		this.increaseIndentation();
	}

	leaveScope() {
		this.decreaseIndentation();
		this.writeLine("}");
	}

	writeLine(line?: string) {
		if (line) {
			if(this._output.endsWith(this.NEWLINE_CHARACTER))
				this.writeIndentation();

			this._write(line);
		}

		this._write(this.NEWLINE_CHARACTER);
	}

	private getLogText(text: string) {
		var logText = text
			.replace(this.NEWLINE_CHARACTER, "\\n")
			.replace("\t", "\\t")
			.replace("\r", "\\r")
			.trim();
		return logText;
	}

	private _write(text: string) {
		this._output += text;

		var logged = this.getLogText(text);
		this.logger.log("Emitted: " + logged);
	}

	public write(text: string) {
		if(this._output.endsWith(this.NEWLINE_CHARACTER))
			this._write(this.currentIndentation);

		this._write(text);
	}

	increaseIndentation() {
		this.logger.log("Increasing indentation to " + (this.indentationLevel+1));
		this.indentationLevel++;
	}

	decreaseIndentation() {
		this.indentationLevel--;
		this.logger.log("Decreased indentation to " + this.indentationLevel);
	}

	removeLastNewLines() {
		this.logger.log("Removing last lines.");
		while (this.removeLastCharacters("\n"));
		while (this.removeLastCharacters("\r"));
	}
	
	emitTypeScriptNodes(nodes: ts.Node[]) {
		nodes = nodes.filter(n => n);

		const resultFile = ts.createSourceFile(
			"", "", ts.ScriptTarget.Latest,
			true, ts.ScriptKind.TS);
		
		const printer = ts.createPrinter({
			newLine: ts.NewLineKind.LineFeed
		});

		for(var node of nodes) {
			const result = printer.printNode(
				ts.EmitHint.Unspecified, 
				node, 
				resultFile);
				
			this._write(result);
			this.ensureNewParagraph();
		}

		this.removeLastNewLines();
	}

	emitTypeScriptNode(node: ts.Node) {
		this.emitTypeScriptNodes([node]);
	}

	ensureNewLine() {
		this.removeLastNewLines();
		this.writeLine();
	}

	ensureNewParagraph() {
		this.ensureNewLine();
		this.writeLine();
	}

	removeLastCharacters(characters: string) {
		if(characters !== this.indentation)
			while (this.removeLastCharacters(this.indentation));

		if (this._output.substr(this._output.length - characters.length) !== characters)
			return false;

		for (var character of characters) {
			if(characters !== this.indentation)
				while (this.removeLastCharacters(this.indentation));

			this._output = this._output.substr(0, this._output.length - character.length);

			if(characters !== this.indentation)
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