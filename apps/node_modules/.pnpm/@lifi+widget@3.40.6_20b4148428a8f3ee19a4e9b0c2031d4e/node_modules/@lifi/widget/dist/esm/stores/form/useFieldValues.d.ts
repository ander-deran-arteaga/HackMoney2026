import type { FormFieldArray, FormFieldNames } from './types.js';
export declare const useFieldValues: <T extends FormFieldNames[]>(...names: T) => FormFieldArray<T>;
