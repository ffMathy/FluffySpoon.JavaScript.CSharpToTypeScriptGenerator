import { CSharpProperty } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface PropertyEmitOptionsBase {
	readOnly?: boolean;
	filter?: (property: CSharpProperty) => boolean;
	typeEmitOptions?: TypeEmitOptions;
}

export interface PropertyEmitOptions extends PropertyEmitOptionsBase {
	perPropertyEmitOptions?: (property: CSharpProperty) => PerPropertyEmitOptions;
}

export interface PerPropertyEmitOptions extends PropertyEmitOptionsBase {
	name?: string;
}

export class PropertyEmitter {
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitProperties(properties: CSharpProperty[], options?: PropertyEmitOptions & PerPropertyEmitOptions) {
		options = this.prepareOptions(options);

		for (var property of properties) {
			this.emitProperty(property, options);
		}
	}

	emitProperty(property: CSharpProperty, options?: PropertyEmitOptions & PerPropertyEmitOptions) {
		var node = this.createTypeScriptPropertyNode(property, options);
		if(node)
			this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptPropertyNode(property: CSharpProperty, options?: PropertyEmitOptions & PerPropertyEmitOptions) {
		options = this.prepareOptions(options);
		options = Object.assign(
			options,
			options.perPropertyEmitOptions(property));

		if (!options.filter(property))
			return;

		var modifiers = new Array<ts.Modifier>();
		if (options.readOnly)
			modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));

		var node = ts.createPropertySignature(
			modifiers,
			options.name || property.name,
			property.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null,
			this.typeEmitter.createTypeScriptTypeReferenceNode(property.type, options.typeEmitOptions),
			null);

		return node;
	}

	private prepareOptions(options?: PropertyEmitOptions) {
		if (!options) {
			options = {};
		}

		if (!options.filter) {
			options.filter = (property) => property.isPublic;
		}

		if (!options.perPropertyEmitOptions) {
			options.perPropertyEmitOptions = (property) => <PerPropertyEmitOptions>{
				name: property.name.charAt(0).toLowerCase() + property.name.substring(1)
			};
		}

		return options;
	}

}