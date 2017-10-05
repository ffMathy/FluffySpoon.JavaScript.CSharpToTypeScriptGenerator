# FluffySpoon.JavaScript.CSharpToTypeScriptGenerator

# Recipes

## Generating DTO models from a source folder
```typescript
import { FileEmitter } from 'fluffy-spoon.javascript.csharp-to-typescript-generator';

var emitter = new FileEmitter("insert the CSharp code here - you could also read it from a file.");
var typescriptCode = emitter.emitFile();
```
