import type { DefaultValues, FormFieldNames, GenericFormValue, SetOptions } from './types.js';
export declare const useFieldActions: () => {
    setFieldValue: (fieldName: FormFieldNames, newValue: GenericFormValue, options?: SetOptions) => void;
    setUserAndDefaultValues: (formValues: Partial<DefaultValues>) => void;
    setDefaultValues: (formValues: DefaultValues) => void;
    isTouched: (fieldName: FormFieldNames) => boolean;
    isDirty: (fieldName: FormFieldNames) => boolean;
    setAsTouched: (fieldName: FormFieldNames) => void;
    resetField: (fieldName: FormFieldNames, resetOptions?: import("./types.js").ResetOptions) => void;
    getFieldValues: <T extends FormFieldNames[]>(...names: T) => import("./types.js").FormFieldArray<T>;
};
