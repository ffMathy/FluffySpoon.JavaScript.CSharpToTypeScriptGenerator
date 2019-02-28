interface IBefore
{
	string MyProperty { get; set; }

	void MyMethod(string foo, params string[] bar);

	void MyNullParameterMethod(string foo = null);

	Task<IEnumerable<string>> TaskArrayMethod();
}

interface IMain<Foo> where Foo : new()
{
	string MyProperty { get; set; }

	SomeStuff<OtherStuff, RegularStuff> BlahProperty { get; set; }

	List<OtherStuff> OtherBlahProperty { get; set; }
}

interface IOther
{
	string MyProperty { get; set; }
}

interface IGeneric<T>
{
    T MyProperty { get; set; }
}

interface IConcreteType : IGeneric<long>
{
}
