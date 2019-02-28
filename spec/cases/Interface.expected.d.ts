declare interface IBefore {
	myProperty: string;
	myMethod(foo: string, ...bar: Array<string>): void;
	myNullParameterMethod(foo?: string): void;
	taskArrayMethod(): Promise<Array<string>>;
}

declare interface IMain<Foo> {
	myProperty: string;
	blahProperty: SomeStuff<OtherStuff, RegularStuff>;
	otherBlahProperty: Array<OtherStuff>;
}

declare interface IOther {
	myProperty: string;
}

declare interface IGeneric<T> {
	myProperty: T;
}

declare interface IConcreteType extends IGeneric<number> {
}