# Framework recipes
These recipes are pre-made options that work with a framework of your choise.

## ASP .NET Core + Angular

### Generating Angular HTTP clients for all controllers and their actions
- Runs through all classes in the C# file that look like controllers (https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions#what-is-a-controller).
- For each controller, an Angular HTTP client is generated with a default constructor injecting Angular's `HttpClient` in.
- Runs through all methods in each controller class that look like actions (https://docs.microsoft.com/en-us/aspnet/core/mvc/controllers/actions#defining-actions).
- For each action, a proper GET/POST/PUT/PATCH method is made with a proper return type (a `Promise` variant of your controller action's original return type).

```typescript
var controllerClassFilter = (classObject: CSharpClass) => {
    var isTypeController = (type: {name: string}) => type.name.endsWith("Controller");

    var inheritsFromController = isTypeController(classObject) || !!classObject.inheritsFrom.filter(isTypeController)[0];
    var hasControllerAttribute = !!classObject.attributes.filter(a => a.name === "Controller")[0];
    var hasNonControllerAttribute = !!classObject.attributes.filter(a => a.name === "NonController")[0];
    
    return (inheritsFromController || hasControllerAttribute) && !hasNonControllerAttribute;
};
  
var actionMethodFilter = (methodObject: CSharpMethod) => {
  var hasNonActionAttribute = !!methodObject.attributes.filter(a => a.name === "NonAction")[0];
  return methodObject.isPublic && !hasNonActionAttribute;
};

var typescriptCode = emitter.emitFile(<EmitOptions>{
    file: <FileEmitOptions>{
        onBeforeEmit: (file: CSharpFile, typescriptEmitter: TypeScriptEmitter) => {
            typescriptEmitter.clear(); //we clear all code the emitter would have normally written and take control ourselves

            typescriptEmitter.writeLine("import { Injectable } from '@angular/core';");
            typescriptEmitter.writeLine("import { HttpClient, HttpParams } from '@angular/common/http';");

            typescriptEmitter.ensureNewParagraph();

            var controllerClasses = file
                .getAllClassesRecursively()
                .filter(controllerClassFilter);
            
            for(var controllerClass of controllerClasses) {
                var controllerNameWithoutSuffix = controllerClass.name;
                if(controllerNameWithoutSuffix.endsWith("Controller"))
                    controllerNameWithoutSuffix = controllerNameWithoutSuffix.substr(0, controllerNameWithoutSuffix.lastIndexOf("Controller"));

                typescriptEmitter.writeLine("@Injectable()");
                typescriptEmitter.enterScope(`export class ${controllerNameWithoutSuffix}Client {`);

                typescriptEmitter.writeLine("constructor(private http: HttpClient) { }");
                typescriptEmitter.ensureNewParagraph();

                var actionMethods = controllerClass
                    .methods
                    .filter(actionMethodFilter);
        
                for(var actionMethod of actionMethods) {								
                    var actionNameCamelCase = actionMethod.name.substr(0, 1).toLowerCase() + actionMethod.name.substr(1);
                    typescriptEmitter.write(`async ${actionNameCamelCase}(`);

                    const typeEmitter = new TypeEmitter(typescriptEmitter);

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

                    typescriptEmitter.enterScope(" {");

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

                    typescriptEmitter.writeLine(").toPromise();");

                    typescriptEmitter.leaveScope();
                    typescriptEmitter.ensureNewParagraph();
                }
                
                typescriptEmitter.ensureNewLine();

                typescriptEmitter.leaveScope();
                typescriptEmitter.ensureNewParagraph();
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
