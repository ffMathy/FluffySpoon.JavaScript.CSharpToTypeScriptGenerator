declare interface MainClass {
	MyProperty: string;
}

declare namespace MainClass {
	interface SubClass {
		MyProperty: string;
	}
}

declare interface OtherClass {
	MyProperty: string;
}