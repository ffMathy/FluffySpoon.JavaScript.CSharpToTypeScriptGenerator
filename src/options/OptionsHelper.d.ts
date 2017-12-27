import { TypeEmitOptions } from '../TypeEmitter';
import { StructEmitOptions } from '../StructEmitter';
import { EnumEmitOptions } from '../EnumEmitter';
import { ClassEmitOptions } from '../ClassEmitter';
import { InterfaceEmitOptions } from '../InterfaceEmitter';
import { NamespaceEmitOptions } from '../NamespaceEmitter';
import { MethodEmitOptions } from '../MethodEmitter';
import { PropertyEmitOptions } from '../PropertyEmitter';
import { FieldEmitOptions } from '../FieldEmitter';
import { FileEmitOptions } from '../FileEmitter';
export interface OptionsInheritanceTreeNode<T> {
    propertyName?: string;
    applyInheritance?: (parent: T, defaultValue?: T) => {
        tree?: OptionsInheritanceTreeNode<any>[] | null;
        result: T;
    };
}
export declare class OptionsHelper {
    static mergeOptions<T extends Object, K extends Object>(defaultOptions: T, initialOptions: T, newOptions: K): T | K;
    private static markFunctionsAsDefault(target);
    private static applyInheritanceTree(parent, tree);
    static prepareFileEmitOptionInheritance(options: FileEmitOptions): FileEmitOptions;
    static prepareEnumEmitOptionDefaults(options: EnumEmitOptions): EnumEmitOptions;
    static prepareTypeEmitOptionDefaults(options: TypeEmitOptions): TypeEmitOptions;
    static prepareFieldEmitOptionDefaults(options: FieldEmitOptions): FieldEmitOptions;
    static preparePropertyEmitOptionDefaults(options: PropertyEmitOptions): PropertyEmitOptions;
    static prepareStructEmitOptionDefaults(options: StructEmitOptions): StructEmitOptions;
    static prepareMethodEmitOptionDefaults(options: MethodEmitOptions): MethodEmitOptions;
    static prepareInterfaceEmitOptionDefaults(options: InterfaceEmitOptions): InterfaceEmitOptions;
    static prepareNamespaceEmitOptionDefaults(options: NamespaceEmitOptions): NamespaceEmitOptions;
    static prepareClassEmitOptionDefaults(options: ClassEmitOptions): ClassEmitOptions;
    static prepareFileEmitOptionDefaults(options: FileEmitOptions): FileEmitOptions;
}
