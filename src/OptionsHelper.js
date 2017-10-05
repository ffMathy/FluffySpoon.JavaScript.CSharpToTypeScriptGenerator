"use strict";
var OptionsHelper = (function () {
    function OptionsHelper() {
    }
    OptionsHelper.prototype.mergeOptions = function (originalParent, originalChild) {
        var me = this;
        if (!Array.isArray(originalParent) && !Array.isArray(originalChild) && typeof originalParent === "object" && typeof originalChild === "object") {
            var parent = Object.assign({}, originalParent);
            var child = Object.assign({}, originalChild);
            for (var parentKey in parent) {
                var _loop_1 = function () {
                    if (!parent.hasOwnProperty(parentKey))
                        return "continue";
                    if (!child.hasOwnProperty(childKey))
                        return "continue";
                    if (parentKey.toString() !== childKey.toString())
                        return "continue";
                    parentValue = parent[parentKey];
                    childValue = child[childKey];
                    if (typeof parentValue !== typeof childValue)
                        throw new Error("Could not merge options [" + typeof parentValue + "] " + parentKey + " and [" + typeof childValue + "] " + childKey + ".");
                    if (parentValue === null || childValue === null)
                        return "continue";
                    type = typeof parentValue;
                    if (type === "function") {
                        var oldChildValue_1 = childValue;
                        childValue = function () {
                            var parentFunctionOutput = parentValue.apply(parentValue, arguments);
                            var childFunctionOutput = oldChildValue_1.apply(parentValue, arguments);
                            return me.mergeOptions(parentFunctionOutput, childFunctionOutput);
                        };
                    }
                    else {
                        childValue = this_1.mergeOptions(parentValue, childValue);
                    }
                    parent[parentKey] = parentValue;
                    child[childKey] = childValue;
                };
                var this_1 = this, parentValue, childValue, type;
                for (var childKey in child) {
                    _loop_1();
                }
            }
            console.log("Merging option object", parent, "with", child);
            var merged = Object.assign(parent, child);
            return merged;
        }
        var result = (typeof originalChild !== "undefined" ? originalChild : originalParent);
        return result;
    };
    return OptionsHelper;
}());
exports.OptionsHelper = OptionsHelper;
//# sourceMappingURL=OptionsHelper.js.map