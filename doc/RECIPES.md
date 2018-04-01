# Recipes
Recipes are pre-made options that work with a framework of your choise.

## ASP .NET Core + Angular

### Generating Angular HTTP clients for all controllers and their actions
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
