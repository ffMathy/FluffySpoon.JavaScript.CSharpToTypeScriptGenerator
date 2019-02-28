class BeforeClass
{
	public string MyProperty { get; set; }

	public void MyMethod(string foo, params string[] bar) { }

	public void MyNullParameterMethod(string foo = null) { }

	public Task<IEnumerable<string>> TaskArrayMethod() { }

	public string foo;
}

class MainClass<Foo> where Foo : new()
{
	public string MyProperty { get; set; }

	public SomeStuff<OtherStuff, RegularStuff> BlahProperty { get; set; }

	public List<OtherStuff> OtherBlahProperty { get; set; }

	public class SubClass
	{
		public string MyProperty { get; set; }
	}
}

class OtherClass
{
	public string MyProperty { get; set; }
}

class BaseGenericClass<T>
{
    public T MyProperty { get; set; }
}

class ConcreteTypeClass : BaseGenericClass<long>
{
}
