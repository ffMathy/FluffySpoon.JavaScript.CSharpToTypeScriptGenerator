declare interface BeforeClass {
	foo: string;
	myProperty: string;
	myMethod(foo: string, ...bar: Array<string>): void;
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