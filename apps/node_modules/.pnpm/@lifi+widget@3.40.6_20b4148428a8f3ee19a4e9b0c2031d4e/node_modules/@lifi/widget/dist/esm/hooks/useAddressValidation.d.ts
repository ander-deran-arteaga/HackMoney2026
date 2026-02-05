import type { Chain, ChainType } from '@lifi/sdk';
export declare enum AddressType {
    Address = 0,
    NameService = 1
}
type ValidationArgs = {
    value: string;
    chainType?: ChainType;
    chain?: Chain;
};
type ValidResponse = {
    address: string;
    addressType: AddressType;
    chainType: ChainType;
    isValid: true;
};
type InvalidResponse = {
    error: string;
    isValid: false;
};
export declare const useAddressValidation: () => {
    validateAddress: import("@tanstack/react-query").UseMutateAsyncFunction<ValidResponse | InvalidResponse, Error, ValidationArgs, unknown>;
    isValidating: boolean;
};
export {};
