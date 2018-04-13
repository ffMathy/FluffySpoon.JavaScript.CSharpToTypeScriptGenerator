import { CSharpMethod, CSharpMethodParameter, CSharpNamedToken } from '@fluffy-spoon/csharp-parser';

import { TypeScriptEmitter } from './TypeScriptEmitter';
import { TypeEmitter, TypeEmitOptions } from './TypeEmitter';
import { Logger } from './Logger';

import ts = require("typescript");
import { OptionsHelper } from './OptionsHelper';

export interface MethodEmitOptionsBase {
	filter?: (method: CSharpMethod) => boolean;
	perMethodEmitOptions?: (method: CSharpMethod) => PerMethodEmitOptions;
}

export interface MethodEmitOptionsLinks {
	returnTypeEmitOptions?: TypeEmitOptions;
	argumentTypeEmitOptions?: TypeEmitOptions;
}

export interface MethodEmitOptions extends MethodEmitOptionsBase, MethodEmitOptionsLinks {
}

export interface PerMethodEmitOptions extends MethodEmitOptionsBase, MethodEmitOptionsLinks {
	name?: string;
}

export class MethodEmitter {
	private optionsHelper: OptionsHelper;
	private typeEmitter: TypeEmitter;

	constructor(
		private typeScriptEmitter: TypeScriptEmitter,
		private logger?: Logger
	) {
		if(!this.logger) 
			this.logger = new Logger();
		
		this.typeEmitter = new TypeEmitter(typeScriptEmitter, logger);
		this.optionsHelper = new OptionsHelper();
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

		this.typeScriptEmitter.emitTypeScriptNode(node);
	}

	createTypeScriptMethodNode(method: CSharpMethod, options: MethodEmitOptions & PerMethodEmitOptions) {
		if(options.perMethodEmitOptions)
			options = this.optionsHelper.mergeOptionsRecursively<any>(
				options.perMethodEmitOptions(method), 
				options);

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
		var node = ts.createParameter(
			[],
			[],
			parameter.isVariadicContainer ? ts.createToken(ts.SyntaxKind.DotDotDotToken) : null,
			parameter.name,
			parameter.defaultValue ? ts.createToken(ts.SyntaxKind.QuestionToken) : null,
			this.typeEmitter.createTypeScriptTypeReferenceNode(
				parameter.type,
				options.argumentTypeEmitOptions),
			null);
		return node;
	}

}
