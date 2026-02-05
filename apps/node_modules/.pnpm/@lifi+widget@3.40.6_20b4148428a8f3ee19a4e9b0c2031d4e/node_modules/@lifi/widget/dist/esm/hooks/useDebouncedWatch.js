import { useEffect, useRef, useState } from 'react';
import { useFieldValues } from '../stores/form/useFieldValues.js';
export const useDebouncedWatch = (delay, ...name) => {
    const watchedValue = useFieldValues(...name);
    const [debouncedValue, setDebouncedValue] = useState(watchedValue);
    const debouncedValueRef = useRef(null);
    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current) {
            const hasWatchedValue = watchedValue.some((value) => value);
            if (hasWatchedValue) {
                const handler = setTimeout(() => {
                    setDebouncedValue(watchedValue);
                }, delay);
                return () => clearTimeout(handler);
            }
            debouncedValueRef.current = watchedValue;
            setDebouncedValue(watchedValue);
            return undefined;
        }
        isMounted.current = true;
        return undefined;
    }, [delay, watchedValue]);
    return debouncedValue;
};
//# sourceMappingURL=useDebouncedWatch.js.map