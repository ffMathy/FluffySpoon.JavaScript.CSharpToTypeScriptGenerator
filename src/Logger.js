"use strict";
var Logger = (function () {
    function Logger() {
    }
    Object.defineProperty(Logger, "debugMessageDisplayed", {
        get: function () {
            return Logger._debugMessageDisplayed;
        },
        enumerable: true,
        configurable: true
    });
    Logger.prototype.debug = function (message) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        this.log(message, parameters);
        Logger._debugMessageDisplayed = true;
        console.log = function () { };
    };
    Logger.prototype.setLogMethod = function (method) {
        this.logMethod = method;
        console.log("Log method set.");
    };
    Logger.prototype.log = function (message) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        if (Logger._debugMessageDisplayed)
            return;
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
