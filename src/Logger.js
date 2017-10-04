"use strict";
var Logger = (function () {
    function Logger() {
    }
    Logger.prototype.setLogMethod = function (method) {
        this.logMethod = method;
        console.log("Log method set.");
    };
    Logger.prototype.log = function (message) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        if (!this.logMethod)
            this.setLogMethod(console.log);
        if (parameters && parameters.length > 0) {
            this.logMethod(message, parameters);
        }
        else {
            this.logMethod(message);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
