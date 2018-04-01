import { Logger } from './Logger';
import ts = require("typescript");
export declare class TypeScriptEmitter {
    private logger;
    private _output;
    private indentationLevel;
    private indentation;
    constructor(logger: Logger);
    clear(): void;
    writeLine(line?: string): void;
    private getLogText(text);
    write(text: string): void;
    increaseIndentation(): void;
    decreaseIndentation(): void;
    removeLastNewLines(): void;
    emitTypeScriptNodes(nodes: ts.Node[]): void;
    emitTypeScriptNode(node: ts.Node): void;
    ensureNewLine(): void;
    ensureNewParagraph(): void;
    removeLastCharacters(characters: string): boolean;
    readonly currentIndentation: string;
    readonly output: string;
    writeIndentation(): void;
}
