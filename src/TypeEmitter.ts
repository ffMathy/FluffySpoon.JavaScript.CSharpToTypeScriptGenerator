import { CSharpType } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';

export class TypeEmitter {
	private defaultTypeMap: { [sourceType: string]: string };

	constructor(private stringEmitter: StringEmitter) {
		this.defaultTypeMap = {
			"IList<T>": "T[]",
			"List<T>": "T[]",
			"IEnumerable<T>": "T[]",
			"ICollection<T>": "T[]",
			"HashSet<T>": "T[]",
			"IDictionary<T,K>": "{ [key: T]: K }",
			"int": "number",
			"double": "number",
			"float": "number",
			"Int32": "number",
			"Int64": "number",
			"short": "number",
			"long": "number",
			"decimal": "number",
			"bool": "boolean",
			"DateTime": "string",
			"Guid": "string",
			"dynamic": "any",
            "object": "any"
		};
    }

	emitType(type: CSharpType) {
		this.stringEmitter.write(type.name);
		if (type.genericParameters) {
			var lastArrowIndex = this.stringEmitter.output.lastIndexOf("<");
			var regionToRemove = this.stringEmitter.output.substring(lastArrowIndex);
			this.stringEmitter.removeLastCharacters(regionToRemove);

			this.stringEmitter.write("<");
			for (var genericParameter of type.genericParameters) {
				this.emitType(genericParameter);
			}
			this.stringEmitter.removeLastCharacters(", ");
			this.stringEmitter.write(">");
		}
    }

}