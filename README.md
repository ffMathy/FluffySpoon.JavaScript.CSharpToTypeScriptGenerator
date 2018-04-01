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
  myProperty: number;
}
```

### Wrapping all emitted code in a namespace
```typescript
var typescriptCode = emitter.emitFile(<EmitOptions>{
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
  myProperty: Date;
  myOtherProperty: string;
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
  myProperty: number;
  myOtherProperty: string;
}
```

**Note:** This can also be done for classes, methods and fields by using the `ClassEmitOptions`, `MethodEmitOptions`, and `FieldEmitOptions` respectively.

### Pascal-casing property names
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
  MyProperty: number;
  MyOtherProperty: string;
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
  myProperty: number;
}

declare interface ISomeInheritedClass {
  myBaseProperty: number;
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
  myProperty: number;
}

declare interface SomeInheritedClass {
  myBaseProperty: number;
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

## ASP .NET Core + Angular

### Generating Angular HTTP clients for all controllers and their actions
Requires `typescript` (by using `npm install typescript --save-dev`).

```typescript
import typescript = require("typescript");

var controllerClassFilter = (classObject: CSharpClass) => {
  //we are only interested in classes that are considered controllers as per: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions#what-is-a-controller
  
  var inheritsFromController = classObject.name.endsWith("Controller") || (classObject.inheritsFrom && classObject.inheritsFrom.name.endsWith("Controller"));
  var hasControllerAttribute = !!classObject.attributes.filter(a => a.name === "Controller")[0];
  var hasNonControllerAttribute = !!classObject.attributes.filter(a => a.name === "NonController")[0];
  
  return (inheritsFromController || hasControllerAttribute) && !hasNonControllerAttribute;
};
  
var actionMethodFilter = (methodObject: CSharpMethod) => {
  //we are only interested in the methods considered actions as per: https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions#defining-actions

  var hasNonActionAttribute = !!methodObject.attributes.filter(a => a.name === "NonAction")[0];
  return methodObject.isPublic && !hasNonActionAttribute;
};

var typescriptCode = emitter.emitFile(<EmitOptions>{
  file: <FileEmitOptions>{
    onBeforeEmit: (file: CSharpFile, typescriptEmitter: TypeScriptEmitter) => {
      typescriptEmitter.clear(); //we clear all code the emitter would have normally written and take control ourselves

      typescriptEmitter.writeLine("import { Injectable } from '@angular/core';");
      typescriptEmitter.writeLine("import { HttpClient, HttpParams } from '@angular/common/http';");

      typescriptEmitter.writeLine();
  
      var controllerClasses = file
        .getAllClassesRecursively()
        .filter(controllerClassFilter);
      
      for(var controllerClass of controllerClasses) {
        var controllerNameWithoutSuffix = controllerClass.name;
        if(controllerNameWithoutSuffix.endsWith("Controller"))
          controllerNameWithoutSuffix = controllerNameWithoutSuffix.substr(0, controllerNameWithoutSuffix.lastIndexOf("Controller"));

        typescriptEmitter.writeLine("@Injectable()");
        typescriptEmitter.writeLine(`export class ${controllerNameWithoutSuffix}Client {`);
        typescriptEmitter.increaseIndentation();

        typescriptEmitter.writeLine("constructor(private http: HttpClient) { }");
        typescriptEmitter.writeLine();

        var actionMethods = controllerClass
          .methods
          .filter(actionMethodFilter);
    
        for(var actionMethod of actionMethods) {
          typescriptEmitter.write(typescriptEmitter.currentIndentation);
            
          var actionNameCamelCase = actionMethod.name.substr(0, 1).toLowerCase() + actionMethod.name.substr(1);
          typescriptEmitter.write(`async ${actionNameCamelCase}(`);

          const typeEmitter = new TypeEmitter(typescriptEmitter, new Logger());

          var parameterOffset = 0;
          for(var parameter of actionMethod.parameters) {
            if(parameterOffset > 0)
              typescriptEmitter.write(", ");

            typescriptEmitter.write(`${parameter.name}: `);

            typeEmitter.emitType(parameter.type);

            parameterOffset++;
          }

          typescriptEmitter.write("): ");

          typeEmitter.emitType(actionMethod.returnType, { 
            mapper: (type, suggested) => {
              if(type.name !== "Task<>") return `Promise<${suggested}>`;
              return suggested;
            }
          });

          typescriptEmitter.write(" {");
          typescriptEmitter.writeLine();
          typescriptEmitter.increaseIndentation();
          typescriptEmitter.write(typescriptEmitter.currentIndentation);

          var method = "get";
          for(var actionAttribute of actionMethod.attributes) {
            switch(actionAttribute.name) {
              case "HttpPost": method = "post"; break;
              case "HttpPut": method = "put"; break;
              case "HttpPatch": method = "patch"; break;
            }
          }

          typescriptEmitter.write(`return this.http.${method}('/api/${controllerNameWithoutSuffix.toLowerCase()}/${actionMethod.name.toLowerCase()}', new HttpParams()`);

          for(var parameter of actionMethod.parameters) {
            typescriptEmitter.write(`.append('${parameter.name}', ${parameter.name})`);
          }

          typescriptEmitter.write(").toPromise();");

          typescriptEmitter.writeLine();
          typescriptEmitter.decreaseIndentation();
          typescriptEmitter.writeLine("}");
          typescriptEmitter.writeLine();
        }

        typescriptEmitter.removeLastNewLines();
        typescriptEmitter.writeLine();

        typescriptEmitter.decreaseIndentation();
        typescriptEmitter.writeLine("}");
      }
    }
  }
});
```

Given the following CSharp model code:

```csharp
public class HomeController {
    public Task<string[]> GetAllUsers(string username, string email) {
        return new [] {
            "foo",
            "bar"
        };
    }

    [HttpPost]
    public bool Login(string username, string password) {
        return true;
    }
}
```

The following TypeScript code would be generated:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class HomeClient {
    constructor(private http: HttpClient) { }

    async getAllUsers(username: string, email: string): Promise<string[]> {
        return this.http.get('/api/home/getallusers', new HttpParams().append('username', username).append('email', email)).toPromise();
    }

    async login(username: string, password: string): Promise<boolean> {
        return this.http.post('/api/home/login', new HttpParams().append('username', username).append('password', password)).toPromise();
    }
}
```
