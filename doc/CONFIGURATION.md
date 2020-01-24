The `EmitOptions` are the root options. They include two properties:

- `defaults` **DefaultEmitOptions**  
  makes it easy to treat specific C# constructs in a specific way per default if no other settings are explicitly specified (for instance, lower-casing all property names). This settings hieracy is flat. 

  - `classEmitOptions` **ClassEmitOptions**  
    configures default class settings. This settings hierachy is flat.  

    - `declare` **boolean**  
      determines whether or not the class should be declared (using the `declare` keyword in TypeScript).  

    - `filter` **(classObject: CSharpClass) => boolean**  
      decides (for every `CSharpClass` considered) whether or not it should be included in the emit.  

    - `perClassEmitOptions` **(classObject: CSharpClass) => PerClassEmitOptions**  

  - `namespaceEmitOptions` **NamespaceEmitOptions**  
    configures default namespace settings. This settings hierachy is flat.  

    - `declare` **boolean**  
      determines whether or not the namespace should be declared (using the `declare` keyword in TypeScript).

	  - `skip` **boolean**  
      determines whether or not the namespace should be skipped (in other words, emitting its contents directly without the enclosing namespace declaration).

	  - `filter` **(namespace: CSharpNamespace) => boolean**  
      decides (for every `CSharpNamespace` considered) whether or not it should be included in the emit.

  - `enumEmitOptions` **EnumEmitOptions**  
    configures default enum settings. This settings hierachy is flat.

    - `declare` **boolean**  

    - `strategy` **"default" | "string-union"**  

    - `filter` **(enumObject: CSharpEnum) => boolean**  

    - `useConst` **boolean**  

  - `structEmitOptions` **StructEmitOptions**  
    configures default struct settings. This settings hierachy is flat.  

    - `declare` **boolean**  
      determines whether or not the struct should be declared (using the `declare` keyword in TypeScript).  

    - `filter` **struct: CSharpStruct) => boolean**  
      decides (for every `CSharpStruct` considered) whether or not it should be included in the emit.

    - `perStructEmitOptions` **(struct: CSharpStruct) => PerStructEmitOptions**  

  - `interfaceEmitOptions` **InterfaceEmitOptions**  
    configures default interfaces settings. This settings hierachy is flat.  

    - `declare` **boolean**  
      determines whether or not the interface should be declared (using the `declare` keyword in TypeScript).  

    - `filter` **(method: CSharpInterface) => boolean**  
      decides (for every `CSharpInterface` considered) whether or not it should be included in the emit.  

    - `perInterfaceEmitOptions` **(interfaceObject: CSharpInterface) => PerInterfaceEmitOptions**  

  - `typeEmitOptions` **TypeEmitOptions**  
    configures default type settings. This settings hierachy is flat.  

    - `mapper` **(type: CSharpType, suggestedOutput: string) => string**  
      allows customization of types. Returns a `string` of pure TypeScript type code (for instance `number|string`). The argument `suggestedOutput` is the TypeScript type that would have been mapped per default (for instance, per default, `int` is mapped to `number`, and `suggestedOutput` would be `number` in that case).  

    - `filter` **(type: CSharpType) => boolean**  
      decides (for every `CSharpType` considered) whether or not it should be included in the emit. Skipped types often cause their parents to also be skipped. For instance, if the type of an argument is skipped, the whole argument is skipped too. Furthermore if the base type of a class is skipped, its `extends` keyword is not emitted either.  

  - `propertyEmitOptions` **PropertyEmitOptions**  
    configures default property settings. This settings hierachy is flat.  

    - `readOnly` **boolean**  
      decides if the TypeScript `readonly` keyword should be used for this property.  

    - `filter` **(property: CSharpProperty) => boolean**  
      decides (for every `CSharpProperty` considered) whether or not it should be included in the emit.  

    - `perPropertyEmitOptions` **(property: CSharpProperty) => PerPropertyEmitOptions**  

  - `fieldEmitOptions` **FieldEmitOptions**  
    configures default field settings. This settings hierachy is flat.  

    - `readOnly` **boolean**  
      decides if the TypeScript `readonly` keyword should be used for this property.  

    - `filter` **(field: CSharpField) => boolean**  
      decides (for every `CSharpField` considered) whether or not it should be included in the emit. 

    - `perFieldEmitOptions` **(field: CSharpField) => PerFieldEmitOptions**  

  - `methodEmitOptions` **MethodEmitOptions**  
    configures default method settings. This settings hierachy is flat.  

- `file` **FileEmitOptions**  
  configures file-level settings. This is a nested configuration hierachy. Every property defined here overrides the default one. This structure is recursive.  

  - `classEmitOptions` **ClassEmitOptions**  
    configures classes found within the file. 

	  - `enumEmitOptions` **EnumEmitOptions**  
      is exactly like the `enumEmitOptions` defined under `FileEmitOptions`, but only applies to the enums found within classes.  

    - `propertyEmitOptions` **PropertyEmitOptions**  
      configures properties found within the class.  

      - `typeEmitOptions` **TypeEmitOptions**  
        configures the type of the property (for instance `string` in `string Foo { get; set; }`).  

    - `interfaceEmitOptions` **InterfaceEmitOptions**  
      is exactly like the `interfaceEmitOptions` defined under `FileEmitOptions`, but only applies to the interfaces found within classes.  

    - `methodEmitOptions` **MethodEmitOptions**  
      configures methods found within the class.  

      - `returnTypeEmitOptions` **TypeEmitOptions**  
        configures the return type of the method (for instance `string` in `string DoFoo() { }`).  

      - `argumentTypeEmitOptions` **TypeEmitOptions**  
        configures the argument types of the method (for instance `string` and `int` in `void DoFoo(string arg1, int arg2) { }`).  

    - `fieldEmitOptions` **FieldEmitOptions**  
      configures fields found within the class.  

      - `typeEmitOptions` **TypeEmitOptions**  
        is exactly like the `typeEmitOptions` defined under `PropertyEmitOptions`, but applies to the type of the field instead of the property.  

    - `structEmitOptions` **StructEmitOptions**  
      is exactly like the `structEmitOptions` defined under `FileEmitOptions`, but only applies to the structs found within classes.  

    - `genericParameterTypeEmitOptions` **TypeEmitOptions**  
      configures generic type parameters of the class (for instance settings for `T` and `K` in the class `Foo<T, K>`).  

    - `inheritedTypeEmitOptions` **TypeEmitOptions**  
      configures the inherited type of the class (for instance `MyBaseClass` for the class `MyClass : MyBaseClass`).  

  - `namespaceEmitOptions` **NamespaceEmitOptions**  
    configures namespaces found within the file.  

	  - `classEmitOptions` **ClassEmitOptions**  
      is exactly like the `classEmitOptions` defined under `FileEmitOptions`, but only applies to the classes found within namespaces.  

	  - `interfaceEmitOptions` **InterfaceEmitOptions**  
      is exactly like the `interfaceEmitOptions` defined under `FileEmitOptions`, but only applies to the interfaces found within namespaces.  

	  - `structEmitOptions` **StructEmitOptions**  
      is exactly like the `structEmitOptions` defined under `FileEmitOptions`, but only applies to the structs found within namespaces.  

	  - `enumEmitOptions` **EnumEmitOptions**  
      is exactly like the `enumEmitOptions` defined under `FileEmitOptions`, but only applies to the enums found within namespaces.  

  - `enumEmitOptions` **EnumEmitOptions**  
    configures enums found within the file.  

  - `structEmitOptions` **StructEmitOptions**  
    configures structs found within the file.  

    - `propertyEmitOptions` **PropertyEmitOptions**  
      is exactly like the `propertyEmitOptions` defined under `ClassEmitOptions`, but only applies to the properties found within structs.  

    - `methodEmitOptions` **MethodEmitOptions**  
      is exactly like the `methodEmitOptions` defined under `ClassEmitOptions`, but only applies to the methods found within structs.  

    - `fieldEmitOptions` **FieldEmitOptions**  
      is exactly like the `fieldEmitOptions` defined under `ClassEmitOptions`, but only applies to the fields found within structs.  

  - `interfaceEmitOptions` **InterfaceEmitOptions**  
    configures interfaces found within the file.  

    - `propertyEmitOptions` **PropertyEmitOptions**  
      is exactly like the `propertyEmitOptions` defined under `ClassEmitOptions`, but only applies to the properties found within interfaces.  

    - `methodEmitOptions` **MethodEmitOptions**  
      is exactly like the `methodEmitOptions` defined under `ClassEmitOptions`, but only applies to the methods found within interfaces.  

    - `genericParameterTypeEmitOptions` **TypeEmitOptions**  
      is exactly like the `genericParameterTypeEmitOptions` defined under `ClassEmitOptions`, but only applies to the generic parameters of interfaces.  

    - `inheritedTypeEmitOptions` **TypeEmitOptions**  
      is exactly like the `inheritedTypeEmitOptions` defined under `ClassEmitOptions`, but only applies to implemented types of interfaces.  

	- `onAfterParse` **(file: CSharpFile) => void**  
    fires right after the C# code has been parsed, but before the TypeScript code has been emitted. `file` here contains the parsed C# code.  

	- `onBeforeEmit` **(file: CSharpFile, typeScriptEmitter: TypeScriptEmitter) => void**   
    fires right after the C# code has been parsed, but before the TypeScript code has been emitted. `file` here contains the parsed C# code, and `typeScriptEmitter` allows for more fine-grained control over the file emission (directly emitting strings into the file) compared to the `onAfterParse` variant.  
