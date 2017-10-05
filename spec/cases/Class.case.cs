class BeforeClass
{
	public string MyProperty { get; set; }
}

class MainClass
{
	public string MyProperty { get; set; }

	public SomeStuff<OtherStuff, RegularStuff> BlahProperty { get; set; }

	public List<OtherStuff> OtherBlahProperty { get; set; }

	class SubClass
	{
		public string MyProperty { get; set; }
	}
}

class OtherClass
{
	public string MyProperty { get; set; }
}