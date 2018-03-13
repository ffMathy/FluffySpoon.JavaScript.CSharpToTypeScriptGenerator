export declare type LogMethod = (message: any, ...parameters: any[]) => void;
export declare class Logger {
    private logMethod;
    private static _debugMessageDisplayed;
    static readonly debugMessageDisplayed: boolean;
    debug(message: any, ...parameters: any[]): void;
    setLogMethod(method: LogMethod): void;
    log(message: any, ...parameters: any[]): void;
}
