interface AddressActivity {
    hasActivity: boolean;
    isLoading: boolean;
    isFetched: boolean;
    toAddress: string | undefined;
}
export declare const useAddressActivity: (chainId?: number) => AddressActivity;
export {};
