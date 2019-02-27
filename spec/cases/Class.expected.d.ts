declare interface BeforeClass {
	foo: string;
	myProperty: string;
	myMethod(foo: string, ...bar: Array<string>): void;
	myNullParameterMethod(foo?: string): void;
	taskArrayMethod(): Promise<Array<string>>;
}

declare interface MainClass<Foo> {
	myProperty: string;
	blahProperty: SomeStuff<OtherStuff, RegularStuff>;
	otherBlahProperty: Array<OtherStuff>;
}

declare namespace MainClass {
	interface SubClass {
		myProperty: string;
	}
}

declare interface OtherClass {
	myProperty: string;
}

declare interface BaseGenericClass<T> {
	myProperty: T;
}

declare interface ConcreteTypeClass extends BaseGenericClass<number> {
}