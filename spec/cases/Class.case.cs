class MainClass
{
	public string MyProperty { get; set; }

	public SomeStuff<OtherStuff> BlahProperty { get; set; }

	public List<OtherStuff, RegularStuff> OtherBlahProperty { get; set; }

	class SubClass
	{
		public string MyProperty { get; set; }
	}
}

class OtherClass
{
	public string MyProperty { get; set; }
}