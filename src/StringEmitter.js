"use strict";
var StringEmitter = (function () {
    function StringEmitter() {
        this._output = '';
        this.indentation = 0;
    }
    StringEmitter.prototype.writeLine = function (line) {
        if (line) {
            this.writeIndentation();
            this.write(line);
        }
        this.write("\n");
    };
    StringEmitter.prototype.write = function (text) {
        this._output += text;
    };
    StringEmitter.prototype.increaseIndentation = function () {
        this.indentation++;
    };
    StringEmitter.prototype.decreaseIndentation = function () {
        this.indentation--;
    };
    StringEmitter.prototype.removeLastCharacters = function (characters) {
        if (this._output.substr(this._output.length - characters.length) !== characters)
            return;
        this._output = this._output.substr(0, this._output.length - characters.length);
    };
    Object.defineProperty(StringEmitter.prototype, "output", {
        get: function () {
            return this._output;
        },
        enumerable: true,
        configurable: true
    });
    StringEmitter.prototype.writeIndentation = function () {
        for (var i = 0; i < this.indentation; i++) {
            this._output += "    ";
        }
    };
    return StringEmitter;
}());
exports.StringEmitter = StringEmitter;
