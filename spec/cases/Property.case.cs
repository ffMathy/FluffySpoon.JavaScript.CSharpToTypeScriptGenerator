class Foobar
{
    string MyProperty { get; set; }

    string ReadOnlyProperty
    {
        get
        {
            return "lol";
        }
    }

    string GetSetProperty
    {
        get
        {
            return "lol";
        }
        set
        {
            //do stuff
        }
    }
}