declare interface BeforeClass {
	foo: string;

	MyProperty: string;
}

declare interface MainClass<Foo> {
	MyProperty: string;
	BlahProperty: SomeStuff<OtherStuff, RegularStuff>;
	OtherBlahProperty: OtherStuff[];
}

declare namespace MainClass {
	interface SubClass {
		MyProperty: string;
	}
}

declare interface OtherClass {
	MyProperty: string;
}