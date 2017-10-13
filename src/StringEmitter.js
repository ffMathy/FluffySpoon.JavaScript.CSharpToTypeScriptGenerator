"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts = require("typescript");
var StringEmitter = (function () {
    function StringEmitter(logger) {
        this.logger = logger;
        this._output = '';
        this.indentationLevel = 0;
        this.indentation = '    ';
    }
    StringEmitter.prototype.writeLine = function (line) {
        if (line) {
            this.writeIndentation();
            this.write(line);
        }
        this.write("\n");
    };
    StringEmitter.prototype.getLogText = function (text) {
        var logText = text
            .replace("\n", "\\n")
            .replace("\t", "\\t")
            .replace("\r", "\\r")
            .trim();
        return logText;
    };
    StringEmitter.prototype.write = function (text) {
        this._output += text;
        var logged = this.getLogText(text);
        this.logger.log("Emitted: " + logged);
    };
    StringEmitter.prototype.increaseIndentation = function () {
        this.logger.log("Increasing indentation to " + (this.indentationLevel + 1));
        this.indentationLevel++;
    };
    StringEmitter.prototype.decreaseIndentation = function () {
        this.indentationLevel--;
        this.logger.log("Decreased indentation to " + this.indentationLevel);
    };
    StringEmitter.prototype.removeLastNewLines = function () {
        this.logger.log("Removing last lines.");
        while (this.removeLastCharacters("\n"))
            ;
        while (this.removeLastCharacters("\r"))
            ;
    };
    StringEmitter.prototype.emitTypeScriptNodes = function (nodes) {
        nodes = nodes.filter(function (n) { return n; });
        var resultFile = ts.createSourceFile("", "", ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
        var printer = ts.createPrinter({
            newLine: ts.NewLineKind.LineFeed
        });
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var result = printer.printNode(ts.EmitHint.Unspecified, node, resultFile);
            this.write(result);
            this.ensureNewParagraph();
        }
        this.removeLastNewLines();
    };
    StringEmitter.prototype.emitTypeScriptNode = function (node) {
        this.emitTypeScriptNodes([node]);
    };
    StringEmitter.prototype.ensureNewLine = function () {
        this.removeLastNewLines();
        this.writeLine();
    };
    StringEmitter.prototype.ensureNewParagraph = function () {
        this.ensureNewLine();
        this.writeLine();
    };
    StringEmitter.prototype.removeLastCharacters = function (characters) {
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
    Object.defineProperty(StringEmitter.prototype, "currentIndentation", {
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
    Object.defineProperty(StringEmitter.prototype, "output", {
        get: function () {
            return this._output.trim();
        },
        enumerable: true,
        configurable: true
    });
    StringEmitter.prototype.writeIndentation = function () {
        this._output += this.currentIndentation;
    };
    return StringEmitter;
}());
exports.StringEmitter = StringEmitter;
//# sourceMappingURL=StringEmitter.js.map