"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringEmitter = (function () {
    function StringEmitter() {
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
        console.log("Emitted: " + logged);
    };
    StringEmitter.prototype.increaseIndentation = function () {
        this.indentationLevel++;
        console.log("Increased indentation to " + this.indentationLevel);
    };
    StringEmitter.prototype.decreaseIndentation = function () {
        this.indentationLevel--;
        console.log("Decreased indentation to " + this.indentationLevel);
    };
    StringEmitter.prototype.removeLastNewLines = function () {
        console.log("Removing last lines.");
        while (this.removeLastCharacters("\n"))
            ;
    };
    StringEmitter.prototype.ensureNewLine = function () {
        this.removeLastNewLines();
        this.writeLine();
    };
    StringEmitter.prototype.ensureLineSplit = function () {
        this.ensureNewLine();
        this.writeLine();
    };
    StringEmitter.prototype.removeLastCharacters = function (characters) {
        if (this._output.substr(this._output.length - characters.length) !== characters)
            return false;
        for (var _i = 0, characters_1 = characters; _i < characters_1.length; _i++) {
            var character = characters_1[_i];
            while (this.removeLastCharacters(this.indentation))
                ;
            this._output = this._output.substr(0, this._output.length - character.length);
            while (this.removeLastCharacters(this.indentation))
                ;
        }
        return true;
    };
    Object.defineProperty(StringEmitter.prototype, "output", {
        get: function () {
            return this._output.trim();
        },
        enumerable: true,
        configurable: true
    });
    StringEmitter.prototype.writeIndentation = function () {
        for (var i = 0; i < this.indentationLevel; i++) {
            this._output += this.indentation;
        }
    };
    return StringEmitter;
}());
exports.StringEmitter = StringEmitter;
