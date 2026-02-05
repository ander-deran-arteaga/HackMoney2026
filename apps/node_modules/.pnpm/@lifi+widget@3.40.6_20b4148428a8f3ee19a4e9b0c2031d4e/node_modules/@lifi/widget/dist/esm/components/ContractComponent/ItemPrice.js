import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { useFieldActions } from '../../stores/form/useFieldActions.js';
import { Token } from '../Token/Token.js';
export const ItemPrice = ({ token, contractCalls, }) => {
    const { setFieldValue } = useFieldActions();
    useEffect(() => {
        if (token) {
            setFieldValue('toChain', token.chainId, { isTouched: true });
            setFieldValue('toToken', token.address, { isTouched: true });
            setFieldValue('toAmount', token.amount ? formatUnits(token.amount, token.decimals) : '', {
                isTouched: true,
            });
        }
        if (contractCalls) {
            setFieldValue('contractCalls', contractCalls, {
                isTouched: true,
            });
        }
    }, [contractCalls, setFieldValue, token]);
    return _jsx(Token, { token: token, p: 2 });
};
//# sourceMappingURL=ItemPrice.js.map