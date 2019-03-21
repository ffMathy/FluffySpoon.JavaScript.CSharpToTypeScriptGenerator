A flexible CSharp to TypeScript generator that is `Gulp`, `Webpack` and `Grunt` friendly, written in TypeScript.

Uses the following library for parsing C# code from TypeScript: https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpParser

# Wrappers for build runners
- **Gulp:** https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpToTypeScriptGenerator.Gulp
- **Grunt:** https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpToTypeScriptGenerator.Grunt
- **Webpack:** https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpToTypeScriptGenerator.Webpack

# Configuration
To see all available settings, [look at the configuration options here](doc/CONFIGURATION.md).

# Usage examples
These recipes help you quickly get started with common scenarios you may need. Feel free to contribute with your own!

The following code shows general usage. The examples below only differ in the `EmitOptions` provided.

```typescript
import { Emitter } from '@fluffy-spoon/csharp-to-typescript-generator';

var csharpCode = "insert the CSharp model code here - you could also read it from a file.";
var emitter = new Emitter(csharpCode);
var options = <EmitOptions>{ 
  defaults: <DefaultEmitOptions>{ },
  file: <FileEmitOptions>{ }
};
var typescriptCode = emitter.emitFile(options);
```

- To see the definitions of each C# type such as `CSharpType`, look here: https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpParser/blob/master/dist/src/Models.ts
- To see the definitions of each option type such as `FileEmitOptions`, look here: https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpToTypeScriptGenerator/blob/master/dist/src/Index.d.ts

## Default settings
```typescript
var typescriptCode = emitter.emit();
```

Given the following CSharp model code:

```csharp
namespace MyNamespace {
  public class MyClass {
    public bool myField;
  
    public int MyProperty { get; set; }
    public string MyOtherProperty { get; set; }
    public double? MyNullableProperty { get; set; }
    
    public class MySubclass {
      public List<string> MyListProperty { get; set; }
      public MyGenericType<SomeType, SomeOtherType> MyGenericProperty { get; set; }
      public Task MyFunction(string input1, int input2) { 
        //some code
      }
    }
  }
}
```

The following TypeScript code would be generated:

```typescript
declare namespace MyNamespace {
  interface MyClass {
    myField: boolean;
    myProperty: number;
    myOtherProperty: string;
    myNullableProperty?: number;
  }
  
  namespace MyClass {
    interface MySubclass {
      myListProperty: string[];
      myGenericProperty: MyGenericType<SomeType, SomeOtherType>;
      MyFunction(input1: string, input2: number): Promise;
    }
  }
}
```

But this framework is flexible! Look at the recipes to get inspiration, or the other configurations available.

## Recipes for frameworks & libraries
To see pre-made examples designed for frameworks like Angular and ASP .NET Core (for instance for auto-generating HTTP clients for each controller action), go [see the framework recipes here](doc/recipes/FRAMEWORKS.md).

## Other recipes
To see all other examples for common use cases, go [see the other recipes here](doc/recipes/OTHER.md).
