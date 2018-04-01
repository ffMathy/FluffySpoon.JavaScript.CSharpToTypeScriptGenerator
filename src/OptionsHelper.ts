export class OptionsHelper {
	mergeOptions<T>(explicitSettings: T, defaultSettings: T): T {
		const properties = Object.getOwnPropertyNames(defaultSettings);
		for(var propertyName of properties) {
			const typeName = typeof defaultSettings[propertyName];
			if(typeName === "object")
				continue;

			if(!(propertyName in explicitSettings))
				explicitSettings[propertyName] = defaultSettings[propertyName];
		}

		return explicitSettings;
	}

	mergeOptionsRecursively<T>(explicitSettings: T, defaultSettings: T): T {
		if(!explicitSettings)
			return defaultSettings;

		const properties = [
			...Object.getOwnPropertyNames(explicitSettings),
			...Object.getOwnPropertyNames(defaultSettings)
		];

		for(let property of properties) {
			if(!(property in defaultSettings)) continue;
			if(typeof defaultSettings[property] !== "object") continue;

			if(!(property in explicitSettings)) {
				explicitSettings[property] = defaultSettings[property];
			} else {
				explicitSettings[property] = this.mergeOptionsRecursively(
					explicitSettings[property], 
					defaultSettings[property]);
			}
		}

		return this.mergeOptions(explicitSettings, defaultSettings);
	}
}
