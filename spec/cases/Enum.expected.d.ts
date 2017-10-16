declare enum MyEnum {
    FirstValue,
    SecondValue = -4,
    ThirdValue = -3,
    FourthValue = 6,
    FifthValue = 7
}

declare namespace Fuz {
    enum Blah {
        Lulz
    }
    namespace Baz {
        enum Lol {
            Bar
        }
    }
}

declare namespace Foo {
    enum StuffEnum {
        Lol,
        Bar = 1
    }
    enum OtherStuffEnum {
        Hello,
        World = 1
    }
    namespace Blah {
        enum MyThingy {
            Lulz
        }
    }
}