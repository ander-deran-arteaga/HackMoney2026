import type { PropsWithChildren } from 'react';
import type { FormRef } from '../../types/widget.js';
interface FormStoreProviderProps extends PropsWithChildren {
    formRef?: FormRef;
}
export declare const FormStoreProvider: React.FC<FormStoreProviderProps>;
export {};
