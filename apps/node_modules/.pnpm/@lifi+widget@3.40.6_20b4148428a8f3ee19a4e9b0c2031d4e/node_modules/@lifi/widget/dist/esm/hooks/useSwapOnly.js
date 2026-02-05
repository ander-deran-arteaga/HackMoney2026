import { useSplitSubvariantStore } from '../stores/settings/useSplitSubvariantStore.js';
export const useSwapOnly = () => {
    const state = useSplitSubvariantStore((state) => state.state);
    return state === 'swap';
};
//# sourceMappingURL=useSwapOnly.js.map