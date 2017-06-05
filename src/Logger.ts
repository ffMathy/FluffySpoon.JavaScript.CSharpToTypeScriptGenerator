declare type LogMethod = (message: any, ...parameters: any[]) => void;

export class Logger {
	private logMethod: LogMethod;

	setLogMethod(method: LogMethod) {
		this.logMethod = method;
        console.log("Log method set.");
	}

	log(message: any, ...parameters: any[]) {
		if (!this.logMethod)
			this.setLogMethod(console.log);

		if (parameters && parameters.length > 0) {
			this.logMethod(message, parameters);
		} else {
			this.logMethod(message);
		}
	}
}