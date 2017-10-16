import { CSharpMethod, CSharpMethodParameter, CSharpNamedToken } from 'fluffy-spoon.javascript.csharp-parser';

import { StringEmitter } from './StringEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

import ts = require("typescript");

export interface MethodEmitOptionsBase {
	filter?: (method: CSharpMethod) => boolean;

	returnTypeEmitOptions?: TypeEmitOptions;
	argumentTypeEmitOptions?: TypeEmitOptions;
}

export interface MethodEmitOptions extends MethodEmitOptionsBase {
	perMethodEmitOptions?: (method: CSharpMethod) => PerMethodEmitOptions;
}

export interface PerMethodEmitOptions extends MethodEmitOptionsBase {
	name?: string;
}

export class MethodEmitter {
	private typeEmitter: TypeEmitter;

	constructor(
		private stringEmitter: StringEmitter,
		private logger: Logger
	) {
		this.typeEmitter = new TypeEmitter(stringEmitter, logger);
	}

	emitMethods(methods: CSharpMethod[], options: MethodEmitOptions & PerMethodEmitOptions) {
		for (var method of methods) {
			this.emitMethod(method, options);
		}
	}

	emitMethod(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions) {
		var node = this.createTypeScriptMethodNode(method, options);
		if(!node)
			return;

		this.stringEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptMethodNode(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions) {
		options = Object.assign(
			options,
			options.perMethodEmitOptions(method));

		if (!options.filter(method))
			return null;

		if (method.isConstructor)
			return null;

		var modifiers = new Array<ts.Modifier>();

		var node = ts.createMethodSignature(
			[],
			this.createTypeScriptMethodParameterNodes(method.parameters, options),
			this.typeEmitter.createTypeScriptTypeReferenceNode(method.returnType, options.returnTypeEmitOptions),
			options.name || method.name,
			null);

		return node;
	}

	private createTypeScriptMethodParameterNodes(parameters: CSharpMethodParameter[], options: MethodEmitOptions) {
		var nodes = new Array<ts.ParameterDeclaration>();
		for (var parameter of parameters) {
			nodes.push(
				this.createTypeScriptMethodParameterNode(parameter, options));
		}
		return nodes;
	}

	private createTypeScriptMethodParameterNode(parameter: CSharpMethodParameter, options: MethodEmitOptions & PerMethodEmitOptions) {
		var initializer: ts.Expression = null;
		if(parameter.defaultValue) 
			initializer = ts.createLiteral(parameter.defaultValue as any);

		var node = ts.createParameter(
			[],
			[],
			null,
			options.name || parameter.name,
			null,
			this.typeEmitter.createTypeScriptTypeReferenceNode(
				parameter.type,
				options.argumentTypeEmitOptions),
			initializer);
		return node;
	}

}