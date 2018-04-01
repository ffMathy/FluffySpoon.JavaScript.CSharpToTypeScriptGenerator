# FluffySpoon.JavaScript.CSharpToTypeScriptGenerator
A flexible CSharp to TypeScript generator that is `Gulp` and `Grunt` friendly, written in TypeScript.

Uses the following library for parsing C# code from TypeScript: https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpParser

## Wrappers
- **Gulp:** https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpToTypeScriptGenerator.Gulp
- **Grunt:** https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpToTypeScriptGenerator.Grunt

# Examples
These recipes help you quickly get started with common scenarios you may need. Feel free to contribute with your own!

The following code shows general usage. The examples below only differ in the `EmitOptions` provided.

```typescript
import { FileEmitter } from 'fluffy-spoon.javascript.csharp-to-typescript-generator';

var csharpCode = "insert the CSharp model code here - you could also read it from a file.";
var emitter = new FileEmitter(csharpCode);
var options = <EmitOptions>{ 
  defaults: <DefaultEmitOptions>{ },
  file: <FileEmitOptions>{ }
};
var typescriptCode = emitter.emitFile(options);
```

**To see the definitions of each type such as `FileEmitOptions`, look here: https://github.com/ffMathy/FluffySpoon.JavaScript.CSharpParser/blob/master/src/Models.ts**

## Plain C#

### Default settings
```typescript
var typescriptCode = emitter.emitFile();
```

Given the following CSharp model code:

```csharp
namespace MyNamespace {
  public class MyClass {
    public int myField;
    private int myPrivateField;
  
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
    myField: number;
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

### Ignoring methods
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <DefaultEmitOptions>{
    methodEmitOptions: <MethodEmitOptions>{
      filter: (method: CSharpMethod) => false //returning false filters away all methods
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass {
  public int MyProperty { get; set; }
  public Task MyFunction(string input1, int input2) { 
    //some code
  }
}
```

The following TypeScript code would be generated:

```typescript
declare interface MyClass {
  MyProperty: number;
}
```

### Wrapping all emitted code in a namespace
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  file: <FileEmitOptions>{
    onAfterParsing: (file: CSharpFile) => {
      //we create a namespace, move all items of the file into that namespace, and remove the same items from the file. 
      //we then add the newly created namespace to the file.

      var namespace = new CSharpNamespace("MyNamespace");
      namespace.classes = file.classes;
      namespace.enums = file.enums;
      namespace.innerScopeText = file.innerScopeText;
      namespace.interfaces = file.interfaces;
      namespace.namespaces = file.namespaces;
      namespace.parent = file;
      namespace.structs = file.structs;
      namespace.usings = file.usings;

      file.classes = [];
      file.enums = [];
      file.interfaces = [];
      file.namespaces = [];
      file.structs = [];
      file.usings = [];

      file.namespaces.push(namespace);
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass {
  public int MyProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare namespace MyNamespace {
  interface MyClass {
    MyProperty: number;
  }
}
```

### Specify what TypeScript types specific CSharp types map to
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <DefaultEmitOptions>{
    typeEmitOptions: <TypeEmitOptions>{
      mapper: (type: CSharpType, suggested: string) => type.name === "DateTime" ? "Date" : suggested
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass {
  public DateTime MyProperty { get; set; }
  public string MyOtherProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare interface MyClass {
  MyProperty: Date;
  MyOtherProperty: string;
}
```

### Including private properties
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <DefaultEmitOptions>{
    propertyEmitOptions: <PropertyEmitOptions>{
      filter: (property: CSharpProperty) => true //the default filter is "property.isPublic === true"
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass {
  private int MyProperty { get; set; }
  public string MyOtherProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare interface MyClass {
  MyProperty: number;
  MyOtherProperty: string;
}
```

**Note:** This can also be done for classes, methods and fields by using the `ClassEmitOptions`, `MethodEmitOptions`, and `FieldEmitOptions` respectively.

### Camel-casing property names
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <DefaultEmitOptions>{
    propertyEmitOptions: <PropertyEmitOptions>{
      perPropertyEmitOptions: (property: CSharpProperty) => <PerPropertyEmitOptions>{
        name: property.name //the default is camel casing
      }
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass {
  public int MyProperty { get; set; }
  public string MyOtherProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare interface MyClass {
  myProperty: number;
  myOtherProperty: string;
}
```

**Note:** This can also be done for classes, types, methods and fields by using the `ClassEmitOptions`, `TypeEmitOptions`, `MethodEmitOptions` and `FieldEmitOptions` respectively.

### Prefixing all class names with "I"
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <DefaultEmitOptions>{
    classEmitOptions: <ClassEmitOptions>{
      perClassEmitOptions: (classObjcect: CSharpClass) => <PerClassEmitOptions>{
        name: "I" + classObject.name,
        inheritedTypeEmitOptions: { 
          //this is needed to also change the name of the inherited class, if any
          mapper: (type, suggested) => "I" + suggested
        }
      }
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass: SomeInheritedClass {
  public int MyProperty { get; set; }
}

public class SomeInheritedClass {
  public int MyBaseProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare interface IMyClass extends ISomeInheritedClass {
  MyProperty: number;
}

declare interface ISomeInheritedClass {
  MyBaseProperty: number;
}
```

**Note:** This can also be done for interfaces by using the `InterfaceEmitOptions` instead.

### Removing inheritance
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <FileEmitOptions>{
    classEmitOptions: <ClassEmitOptions>{
      perClassEmitOptions: (classObjcect: CSharpClass) => <PerClassEmitOptions>{
        inheritedTypeEmitOptions: { 
          //by mapping the inherited type to "null", it is not emitted
          mapper: (type, suggested) => null
        }
      }
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class MyClass: SomeInheritedClass {
  public int MyProperty { get; set; }
}

public class SomeInheritedClass {
  public int MyBaseProperty { get; set; }
}
```

The following TypeScript code would be generated:

```typescript
declare interface MyClass {
  MyProperty: number;
}

declare interface SomeInheritedClass {
  MyBaseProperty: number;
}
```

**Note:** This can also be done for interfaces by using the `InterfaceEmitOptions` instead.

### Convert enums to string union types
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
  defaults: <DefaultEmitOptions>{
    enumEmitOptions: <EnumEmitOptions>{
      strategy: "string-union"
    }
  }
});
```

Given the following CSharp model code:

```csharp
public enum MyEnum {
  FirstOption,
  SecondOption
}
```

The following TypeScript code would be generated:

```typescript
declare type MyEnum =
  'FirstOption' |
  'SecondOption'
```

## ASP .NET Core

### Generating AJAX clients for all controllers
```typescript
var controllerClassFilter = (classObject: CSharpClass) => {
  //we are only interested in classes that are considered controllers as per: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions#what-is-a-controller

  if(!classObject.inheritsFrom) return false;
  
  var inheritsFromController = classObject.inheritsFrom.name.endsWith("Controller");
  var hasControllerAttribute = !!classObject.attributes.filter(a => a.name === "Controller")[0];
  var hasNonControllerAttribute = !!classObject.attributes.filter(a => a.name === "NonController")[0];

  return (inheritsFromController || hasControllerAttribute) && !hasNonControllerAttribute;
};

var actionMethodFilter = (methodObject: CSharpMethod) => {
    //we are only interested in the methods considered actions as per: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions#defining-actions

    var hasNonActionAttribute = !!classObject.attributes.filter(a => a.name === "NonAction")[0];
    return methodObject.isPublic && !hasNonActionAttribute;
}

var typescriptCode = emitter.emitFile(<EmitOptions>{
  file: <FileEmitOptions>{
    classEmitOptions: <ClassEmitOptions>{
      filter: (classObject: CSharpClass) => false //we exclude all classes since we want to skip the normal typings generation since we emit something else in onAfterParsing
    },
    propertyEmitOptions: <PropertyEmitOptions>{
      filter: (property: CSharpProperty) => false //we exclude all properties
    },
    fieldEmitOptions: <FieldEmitOptions>{
      filter: (field: CSharpField) => false //we exclude all fields
    },
    onAfterParsing: (file: CSharpFile, stringEmitter: StringEmitter) => {
      var controllerClasses = file
        .getAllClassesRecursively()
        .filter(controllerClassFilter);
      
      for(var controllerClass of controllerClasses) {
        var actionMethods = controllerClass
          .methods
          .filter(actionMethodFilter);

        for(var actionMethod of actionMethods) {
          stringEmitter.
        }
      }
    }
  }
});
```

Given the following CSharp model code:

```csharp
public enum MyEnum {
  FirstOption,
  SecondOption
}
```

The following TypeScript code would be generated:

```typescript
declare type MyEnum =
  'FirstOption' |
  'SecondOption'
```
