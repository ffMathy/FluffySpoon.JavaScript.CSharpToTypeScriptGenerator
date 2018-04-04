# Ignoring methods
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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
  myProperty: number;
}
```

# Wrapping all emitted code in a namespace
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
  file: <FileEmitOptions>{
    onAfterParse: (file: CSharpFile) => {
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
    myProperty: number;
  }
}
```

# Specify what TypeScript types specific CSharp types map to
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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
  myProperty: Date;
  myOtherProperty: string;
}
```

# Including private properties
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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
  myProperty: number;
  myOtherProperty: string;
}
```

**Note:** This can also be done for classes, methods and fields by using the `ClassEmitOptions`, `MethodEmitOptions`, and `FieldEmitOptions` respectively.

# Pascal-casing property names
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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
  MyProperty: number;
  MyOtherProperty: string;
}
```

**Note:** This can also be done for classes, types, methods and fields by using the `ClassEmitOptions`, `TypeEmitOptions`, `MethodEmitOptions` and `FieldEmitOptions` respectively.

# Prefixing all class names with "I"
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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
  myProperty: number;
}

declare interface ISomeInheritedClass {
  myBaseProperty: number;
}
```

**Note:** This can also be done for interfaces by using the `InterfaceEmitOptions` instead.

# Removing inheritance
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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
  myProperty: number;
}

declare interface SomeInheritedClass {
  myBaseProperty: number;
}
```

**Note:** This can also be done for interfaces by using the `InterfaceEmitOptions` instead.

# Convert enums to string union types
```typescript
var typescriptCode = emitter.emit(<EmitOptions>{
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