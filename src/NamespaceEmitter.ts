import { FileParser, CSharpNamespace } from 'fluffy-spoon.javascript.csharp-parser';
import { StringEmitter } from './StringEmitter';
import { EnumEmitter } from './EnumEmitter';

declare interface NamespaceEmitOptions {
    declare: boolean;
}

export class NamespaceEmitter {
    private enumEmitter: EnumEmitter;

    constructor(
        private stringEmitter: StringEmitter)
    {
        this.enumEmitter = new EnumEmitter(stringEmitter);
    }

    emitNamespaces(namespaces: CSharpNamespace[], options?: NamespaceEmitOptions) {
        for (var namespace of namespaces) {
            this.emitNamespace(namespace, options);
        }
    }

    emitNamespace(namespace: CSharpNamespace, options?: NamespaceEmitOptions) {
        if (!options) {
            options = {
                declare: true
            }
        }

        if (namespace.enums.length === 0 && namespace.namespaces.length === 0) {
            return;
        }

        this.stringEmitter.writeIndentation();
        if (options.declare)
            this.stringEmitter.write("declare ");

        this.stringEmitter.write("namespace " + namespace.name + " {");
        this.stringEmitter.writeLine();

        this.stringEmitter.increaseIndentation();

        this.enumEmitter.emitEnums(
            namespace.enums,
            {
                declare: false
            });

        this.emitNamespaces(
            namespace.namespaces,
            {
                declare: false
            });

        this.stringEmitter.removeLastCharacters("\n\n");

        this.stringEmitter.decreaseIndentation();

        this.stringEmitter.writeLine();
        this.stringEmitter.writeLine("}");
        this.stringEmitter.writeLine();
    }
}