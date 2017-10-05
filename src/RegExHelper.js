"use strict";
var RegExHelper = (function () {
    function RegExHelper() {
    }
    RegExHelper.prototype.escape = function (input) {
        return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };
    return RegExHelper;
}());
exports.RegExHelper = RegExHelper;
//# sourceMappingURL=RegExHelper.js.map