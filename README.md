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

#### Example
Given the following CSharp model code:

```csharp
public class MyClass {
  public int MyProperty { get; set; }
  public string MyOtherProperty { get; set; }
  public double? MyNullableProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare interface MyClass {
  MyProperty: number;
  MyOtherProperty: string;
  MyNullableProperty?: number;
}
```

## Angular
### Generating TypeScript AJAX clients for CSharp controllers
