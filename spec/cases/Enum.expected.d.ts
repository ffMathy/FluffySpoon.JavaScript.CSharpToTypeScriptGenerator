declare enum MyEnum {
    FirstValue = 0,
    SecondValue = -4,
    ThirdValue = -3,
    FourthValue = 6,
    FifthValue = 7
}

declare namespace Fuz {
    enum Blah {
        Lulz = 0
    }

    namespace Baz {
        enum Lol {
            Bar = 0
        }
    }
}

declare namespace Foo {
    enum StuffEnum {
        Lol = 0,
        Bar = 1
    }

    enum OtherStuffEnum {
        Hello = 0,
        World = 1
    }

    namespace Blah {
        enum MyThingy {
            Lulz = 0
        }
    }
}