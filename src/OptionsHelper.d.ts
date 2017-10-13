import { TypeEmitOptions } from './TypeEmitter';
import { StructEmitOptions } from './StructEmitter';
import { EnumEmitOptions } from './EnumEmitter';
import { ClassEmitOptions } from './ClassEmitter';
import { InterfaceEmitOptions } from './InterfaceEmitter';
import { NamespaceEmitOptions } from './NamespaceEmitter';
import { MethodEmitOptions } from './MethodEmitter';
import { PropertyEmitOptions } from './PropertyEmitter';
import { FieldEmitOptions } from './FieldEmitter';
import { FileEmitOptions } from './FileEmitter';
export interface OptionsInheritanceTreeNode<T> {
    typeName: string;
    applyInheritance?: (parent: T) => T;
    inheritanceTree: OptionsInheritanceTreeNode<any>[];
}
export declare class OptionsHelper {
    prepareFileEmitOptionInheritance(options: FileEmitOptions): void;
    prepareEnumEmitOptionDefaults(options: EnumEmitOptions): EnumEmitOptions;
    prepareTypeEmitOptionDefaults(options: TypeEmitOptions): TypeEmitOptions;
    prepareFieldEmitOptionDefaults(options: FieldEmitOptions): FieldEmitOptions;
    preparePropertyEmitOptionDefaults(options: PropertyEmitOptions): PropertyEmitOptions;
    prepareStructEmitOptionDefaults(options: StructEmitOptions): StructEmitOptions;
    prepareMethodEmitOptionDefaults(options: MethodEmitOptions): MethodEmitOptions;
    prepareInterfaceEmitOptionDefaults(options: InterfaceEmitOptions): InterfaceEmitOptions;
    prepareNamespaceEmitOptionDefaults(options: NamespaceEmitOptions): NamespaceEmitOptions;
    prepareClassEmitOptionDefaults(options: ClassEmitOptions): ClassEmitOptions;
    prepareFileEmitOptionDefaults(options: FileEmitOptions): FileEmitOptions;
}
