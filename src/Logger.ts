export declare type LogMethod = (message: any, ...parameters: any[]) => void;

export class Logger {
	private logMethod: LogMethod;

	private static _debugMessageDisplayed: boolean;
	public static get debugMessageDisplayed() {
		return Logger._debugMessageDisplayed;
	}

	debug(message: any, ...parameters: any[]) {
		this.log(message, parameters);
		Logger._debugMessageDisplayed = true;
		console.log = () => {};
	}

	setLogMethod(method: LogMethod) {
		this.logMethod = method;
	}

	log(message: any, ...parameters: any[]) {
		if(Logger._debugMessageDisplayed)
			return;

		if (!this.logMethod)
			this.setLogMethod(() => {});

		if (parameters && parameters.length > 0) {
			this.logMethod(message, parameters);
		} else {
			this.logMethod(message);
		}
	}
}
