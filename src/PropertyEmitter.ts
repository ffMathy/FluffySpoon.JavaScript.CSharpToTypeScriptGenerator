import { CSharpProperty } from '@fluffy-spoon/csharp-parser';
import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { OptionsHelper } from './OptionsHelper';

export interface PropertyEmitOptionsBase {
	readOnly?: boolean;
	filter?: (property: CSharpProperty) => boolean;
	perPropertyEmitOptions?: (property: CSharpProperty) => PerPropertyEmitOptions;
}

export interface PropertyEmitOptionsLinks {
	typeEmitOptions?: TypeEmitOptions;
}

export interface PropertyEmitOptions extends PropertyEmitOptionsBase, PropertyEmitOptionsLinks {
}

export interface PerPropertyEmitOptions extends PropertyEmitOptionsBase, PropertyEmitOptionsLinks {
	name?: string;
}

export class PropertyEmitter {
	private typeEmitter: TypeEmitter;
	private optionsHelper: OptionsHelper;

	constructor(
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger
	) {
		if(!this.logger) 
			this.logger = new Logger();
		
		this.typeEmitter = new TypeEmitter(typeScriptEmitter, logger);
		this.optionsHelper = new OptionsHelper();
	}

	emitProperties(properties: CSharpProperty[], options: PropertyEmitOptions & PerPropertyEmitOptions) {
		for (var property of properties) {
			this.emitProperty(property, options);
		}
	}

	emitProperty(property: CSharpProperty, options: PropertyEmitOptions & PerPropertyEmitOptions) {
		var node = this.createTypeScriptPropertyNode(property, options);
		if(!node)
			return;

		this.typeScriptEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptPropertyNode(property: CSharpProperty, options: PropertyEmitOptions & PerPropertyEmitOptions) {
		if(options.perPropertyEmitOptions)
			options = this.optionsHelper.mergeOptionsRecursively<any>(
				options.perPropertyEmitOptions(property), 
				options);

		if (!options.filter(property))
			return null;

		var modifiers = new Array<ts.Modifier>();
		if ((typeof options.readOnly !== "boolean" || options.readOnly) && property.isReadOnly)
			modifiers.push(ts.createToken(ts.SyntaxKind.ReadonlyKeyword));

		var node = ts.createPropertySignature(
			modifiers,
			options.name || property.name,
			property.type.isNullable ? ts.createToken(ts.SyntaxKind.QuestionToken) : null,
			this.typeEmitter.createTypeScriptTypeReferenceNode(
				property.type, 
				options.typeEmitOptions),
			null);

		return node;
	}

}
