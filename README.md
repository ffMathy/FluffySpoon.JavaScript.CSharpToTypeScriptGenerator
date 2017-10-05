# FluffySpoon.JavaScript.CSharpToTypeScriptGenerator

# Recipes

## Generating TypeScript DTO models from CSharp source code
```typescript
import { FileEmitter } from 'fluffy-spoon.javascript.csharp-to-typescript-generator';

var emitter = new FileEmitter("insert the CSharp code here - you could also read it from a file.");
var typescriptCode = emitter.emitFile();
```
