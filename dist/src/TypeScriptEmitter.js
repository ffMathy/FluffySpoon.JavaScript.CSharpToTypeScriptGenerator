"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var TypeScriptEmitter = /** @class */ (function () {
    function TypeScriptEmitter(logger) {
        this.logger = logger;
        this.NEWLINE_CHARACTER = "\n";
        this._output = '';
        this.indentationLevel = 0;
        this.indentation = '    ';
    }
    TypeScriptEmitter.prototype.clear = function () {
        this._output = '';
    };
    TypeScriptEmitter.prototype.writeLine = function (line) {
        if (line) {
            if (this._output.endsWith(this.NEWLINE_CHARACTER))
                this.writeIndentation();
            this._write(line);
        }
        this._write(this.NEWLINE_CHARACTER);
    };
    TypeScriptEmitter.prototype.getLogText = function (text) {
        var logText = text
            .replace(this.NEWLINE_CHARACTER, "\\n")
            .replace("\t", "\\t")
            .replace("\r", "\\r")
            .trim();
        return logText;
    };
    TypeScriptEmitter.prototype._write = function (text) {
        this._output += text;
        var logged = this.getLogText(text);
        this.logger.log("Emitted: " + logged);
    };
    TypeScriptEmitter.prototype.write = function (text) {
        if (this._output.endsWith(this.NEWLINE_CHARACTER))
            this._write(this.currentIndentation);
        this._write(text);
    };
    TypeScriptEmitter.prototype.increaseIndentation = function () {
        this.logger.log("Increasing indentation to " + (this.indentationLevel + 1));
        this.indentationLevel++;
    };
    TypeScriptEmitter.prototype.decreaseIndentation = function () {
        this.indentationLevel--;
        this.logger.log("Decreased indentation to " + this.indentationLevel);
    };
    TypeScriptEmitter.prototype.removeLastNewLines = function () {
        this.logger.log("Removing last lines.");
        while (this.removeLastCharacters("\n"))
            ;
        while (this.removeLastCharacters("\r"))
            ;
    };
    TypeScriptEmitter.prototype.emitTypeScriptNodes = function (nodes) {
        nodes = nodes.filter(function (n) { return n; });
        var resultFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        var printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        });
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var result = printer.printNode(ts.EmitHint.Unspecified, node, resultFile);
            this._write(result);
            this.ensureNewParagraph();
        }
        this.removeLastNewLines();
    };
    TypeScriptEmitter.prototype.emitTypeScriptNode = function (node) {
        this.emitTypeScriptNodes([node]);
    };
    TypeScriptEmitter.prototype.ensureNewLine = function () {
        this.removeLastNewLines();
        this.writeLine();
    };
    TypeScriptEmitter.prototype.ensureNewParagraph = function () {
        this.ensureNewLine();
        this.writeLine();
    };
    TypeScriptEmitter.prototype.removeLastCharacters = function (characters) {
        if (characters !== this.indentation)
            while (this.removeLastCharacters(this.indentation))
                ;
        if (this._output.substr(this._output.length - characters.length) !== characters)
            return false;
        for (var _i = 0, characters_1 = characters; _i < characters_1.length; _i++) {
            var character = characters_1[_i];
            if (characters !== this.indentation)
                while (this.removeLastCharacters(this.indentation))
                    ;
            this._output = this._output.substr(0, this._output.length - character.length);
            if (characters !== this.indentation)
                while (this.removeLastCharacters(this.indentation))
                    ;
        }
        return true;
    };
    Object.defineProperty(TypeScriptEmitter.prototype, "currentIndentation", {
        get: function () {
            var indentation = "";
            for (var i = 0; i < this.indentationLevel; i++) {
                indentation += this.indentation;
            }
            return indentation;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TypeScriptEmitter.prototype, "output", {
        get: function () {
            return this._output.trim();
        },
        enumerable: true,
        configurable: true
    });
    TypeScriptEmitter.prototype.writeIndentation = function () {
        this._output += this.currentIndentation;
    };
    return TypeScriptEmitter;
}());
exports.TypeScriptEmitter = TypeScriptEmitter;
//# sourceMappingURL=TypeScriptEmitter.js.map