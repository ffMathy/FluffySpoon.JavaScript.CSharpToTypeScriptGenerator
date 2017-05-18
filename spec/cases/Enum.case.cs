enum MyEnum
{
    FirstValue,
    [SomeStuff]
    [SomeAttribute("qwdqkwd, lol hehe")]
    SecondValue = -4,
    [SomeAttribute(DisplayName = "foobar, lol")]
    ThirdValue,
    [SomeAttribute, FooAttribute("lol"), BlahAttribute(DisplayName = "qwdkqwd, test")]
    FourthValue = 6,
    FifthValue
}

namespace Fuz
{
    enum Blah
    {
        Lulz
    }

    namespace Baz
    {
        enum Lol
        {
            Bar
        }
    }
}

class Foo
{
    enum StuffEnum
    {
        Lol,
        Bar
    }

    enum OtherStuffEnum
    {
        Hello,
        World
    }

    class Blah
    {
        enum MyThingy
        {
            Lulz
        }
    }
}