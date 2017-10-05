# FluffySpoon.JavaScript.CSharpToTypeScriptGenerator

# Recipes
These recipes help you quickly get started with common scenarios you may need. Feel free to contribute with your own!

## TypeScript
### Generating TypeScript DTO models from CSharp models
```typescript
import { FileEmitter } from 'fluffy-spoon.javascript.csharp-to-typescript-generator';

var csharpCode = "insert the CSharp model code here - you could also read it from a file.";
var emitter = new FileEmitter(csharpCode);
var typescriptCode = emitter.emitFile();
```

#### Example with default settings
```typescript
var typescriptCode = emitter.emitFile();
```

Given the following CSharp model code:

```csharp
namespace MyNamespace {
  public class MyClass {
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
    MyProperty: number;
    MyOtherProperty: string;
    MyNullableProperty?: number;
  }
  
  namespace MyClass {
    interface MySubclass {
      MyListProperty: string[];
      MyGenericProperty: MyGenericType<SomeType, SomeOtherType>;
      MyFunction(input1: string, input2: number): Promise;
    }
  }
}
```

## Angular
### Generating TypeScript AJAX clients for CSharp controllers
