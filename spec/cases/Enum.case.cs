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
    public enum StuffEnum
    {
        Lol,
        Bar
    }

    public enum OtherStuffEnum
    {
        Hello,
        World
    }

    public class Blah
    {
        public enum MyThingy
        {
            Lulz
        }
    }
}