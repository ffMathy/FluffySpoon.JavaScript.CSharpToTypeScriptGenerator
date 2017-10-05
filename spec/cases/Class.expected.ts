declare interface MainClass {
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