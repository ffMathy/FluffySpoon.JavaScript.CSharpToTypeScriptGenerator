"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OptionsHelper = /** @class */ (function () {
    function OptionsHelper() {
    }
    OptionsHelper.prototype.mergeOptions = function (explicitSettings, defaultSettings) {
        var properties = Object.getOwnPropertyNames(defaultSettings);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var propertyName = properties_1[_i];
            var typeName = typeof defaultSettings[propertyName];
            if (typeName === "object")
                continue;
            if (!(propertyName in explicitSettings))
                explicitSettings[propertyName] = defaultSettings[propertyName];
        }
        return explicitSettings;
    };
    OptionsHelper.prototype.mergeOptionsRecursively = function (explicitSettings, defaultSettings) {
        var properties = Object.getOwnPropertyNames(explicitSettings).concat(Object.getOwnPropertyNames(defaultSettings));
        for (var _i = 0, properties_2 = properties; _i < properties_2.length; _i++) {
            var property = properties_2[_i];
            if (!(property in defaultSettings))
                continue;
            if (typeof defaultSettings[property] !== "object")
                continue;
            if (!(property in explicitSettings)) {
                explicitSettings[property] = defaultSettings[property];
            }
            else {
                explicitSettings[property] = this.mergeOptionsRecursively(explicitSettings[property], defaultSettings[property]);
            }
        }
        return this.mergeOptions(explicitSettings, defaultSettings);
    };
    return OptionsHelper;
}());
exports.OptionsHelper = OptionsHelper;
//# sourceMappingURL=OptionsHelper.js.map