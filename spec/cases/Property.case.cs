class Foobar
{
    public string MyProperty { get; set; }

    public string ReadOnlyProperty
    {
        get
        {
            return "lol";
        }
    }

    public string GetSetProperty
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