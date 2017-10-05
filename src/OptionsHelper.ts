
export class OptionsHelper {
    mergeOptions<T extends Object, K extends Object>(originalParent: T, originalChild: K): T&K {
        let me = this;

        var parent = Object.assign({}, originalParent);
        var child = Object.assign({}, originalChild);

        if(!Array.isArray(parent) && !Array.isArray(child) && typeof parent === "object" && typeof child === "object") {
            for(var parentKey in parent)
            for(var childKey in child) {
                if(!parent.hasOwnProperty(parentKey)) continue;
                if(!child.hasOwnProperty(childKey)) continue;

                if(parentKey.toString() !== childKey.toString()) continue;

                var parentValue = <any>parent[parentKey];
                var childValue = <any>child[childKey];
                if(typeof parentValue !== typeof childValue)
                    throw new Error("Could not merge options [" + typeof parentValue + "] " + parentKey + " and [" + typeof childValue + "] " + childKey + ".");

                if(parentValue === null || childValue === null) 
                    continue;

                var type = typeof parentValue;
                if(type === "function") {
                    let oldChildValue = childValue;
                    childValue = function() {
                        var parentFunctionOutput = (parentValue as Function).apply(parentValue, arguments);
                        var childFunctionOutput = (oldChildValue as Function).apply(parentValue, arguments);
                        return me.mergeOptions(parentFunctionOutput, childFunctionOutput);
                    };
                } else {
                    childValue = this.mergeOptions(parentValue, childValue);
                }

                parent[parentKey] = parentValue;
                child[childKey] = childValue;
            }

            var merged = Object.assign(
                parent,
                child);
            return merged;
        }

        var result = <any>(typeof child !== "undefined" ? child : parent);
        return result;
    }
}