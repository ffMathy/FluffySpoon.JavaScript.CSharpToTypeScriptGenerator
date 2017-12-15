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
    propertyName?: string;
    applyInheritance?: (parent: T, defaultValue?: T) => {
        tree?: OptionsInheritanceTreeNode<any>[] | null;
        result: T;
    };
}
export declare class OptionsHelper {
    private mergeOptions<T, K>(defaultOptions, newOptions);
    private applyInheritanceTree(parent, tree);
    prepareFileEmitOptionInheritance(options: FileEmitOptions): FileEmitOptions;
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
