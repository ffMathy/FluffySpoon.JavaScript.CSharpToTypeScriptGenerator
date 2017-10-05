import { Logger } from './Logger';
export declare class StringEmitter {
    private logger;
    private _output;
    private indentationLevel;
    private indentation;
    constructor(logger: Logger);
    writeLine(line?: string): void;
    private getLogText(text);
    write(text: string): void;
    increaseIndentation(): void;
    decreaseIndentation(): void;
    removeLastNewLines(): void;
    ensureNewLine(): void;
    ensureNewParagraph(): void;
    removeLastCharacters(characters: string): boolean;
    readonly currentIndentation: string;
    readonly output: string;
    writeIndentation(): void;
}
