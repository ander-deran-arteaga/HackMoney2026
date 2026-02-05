import { isAddress } from 'viem';
import { useTransactionCount } from 'wagmi';
import { useFieldValues } from '../stores/form/useFieldValues.js';
export const useAddressActivity = (chainId) => {
    const [toAddress, toChainId] = useFieldValues('toAddress', 'toChain');
    const destinationChainId = chainId ?? toChainId;
    const { data: transactionCount, isLoading, isFetched, error, } = useTransactionCount({
        address: toAddress,
        chainId: destinationChainId,
        query: {
            enabled: Boolean(toAddress && destinationChainId && isAddress(toAddress)),
            refetchInterval: 300000,
            staleTime: 300000,
        },
    });
    return {
        toAddress,
        hasActivity: Boolean(transactionCount && transactionCount > 0),
        isLoading,
        isFetched: isFetched && !error,
    };
};
//# sourceMappingURL=useAddressActivity.js.map