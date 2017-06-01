"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegExHelper = (function () {
    function RegExHelper() {
    }
    RegExHelper.prototype.escape = function (input) {
        return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
