import type { RouteExtended } from '@lifi/sdk';
export declare const useFromTokenSufficiency: (route?: RouteExtended) => {
    insufficientFromToken: boolean | undefined;
    isLoading: boolean;
};
