"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RegExHelper = /** @class */ (function () {
    function RegExHelper() {
    }
    RegExHelper.prototype.escape = function (input) {
        return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
//# sourceMappingURL=RegExHelper.js.map