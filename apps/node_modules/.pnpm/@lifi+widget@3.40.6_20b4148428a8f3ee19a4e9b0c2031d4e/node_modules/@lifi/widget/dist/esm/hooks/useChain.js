import { useMemo } from 'react';
import { useAvailableChains } from './useAvailableChains.js';
export const useChain = (chainId) => {
    const { isLoading, getChainById } = useAvailableChains();
    const chain = useMemo(() => getChainById(chainId), [chainId, getChainById]);
    return {
        chain,
        isLoading,
        getChainById,
    };
};
//# sourceMappingURL=useChain.js.map