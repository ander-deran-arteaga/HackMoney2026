import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card/Card.js';
import { Token } from '../../components/Token/Token.js';
import { TokenDivider } from '../../components/Token/Token.style.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
export const TransactionHistoryItem = ({ transaction, start }) => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const sending = transaction.sending;
    const receiving = transaction
        .receiving;
    const handleClick = () => {
        navigate(navigationRoutes.transactionDetails, {
            state: {
                transactionHash: transaction.sending.txHash,
            },
        });
    };
    const startedAt = new Date((sending.timestamp ?? 0) * 1000);
    if (!sending.token?.chainId || !receiving.token?.chainId) {
        return null;
    }
    const fromToken = {
        ...sending.token,
        amount: BigInt(sending.amount ?? '0'),
        priceUSD: sending.token.priceUSD ?? '0',
        symbol: sending.token?.symbol ?? '',
        decimals: sending.token?.decimals ?? 0,
        name: sending.token?.name ?? '',
        chainId: sending.token?.chainId,
    };
    const toToken = {
        ...receiving.token,
        amount: BigInt(receiving.amount ?? '0'),
        priceUSD: receiving.token.priceUSD ?? '0',
        symbol: receiving.token?.symbol ?? '',
        decimals: receiving.token?.decimals ?? 0,
        name: receiving.token?.name ?? '',
        chainId: receiving.token?.chainId,
    };
    return (_jsxs(Card, { onClick: handleClick, style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            // height: `${size}px`,
            transform: `translateY(${start}px)`,
        }, children: [_jsxs(Box, { sx: {
                    pt: 1.75,
                    px: 2,
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                }, children: [_jsx(Typography, { sx: {
                            fontSize: 12,
                        }, children: startedAt.toLocaleString(i18n.language, { dateStyle: 'long' }) }), _jsx(Typography, { sx: {
                            fontSize: 12,
                        }, children: startedAt.toLocaleString(i18n.language, {
                            timeStyle: 'short',
                        }) })] }), _jsxs(Box, { sx: {
                    px: 2,
                    py: 2,
                }, children: [_jsx(Token, { token: fromToken }), _jsx(Box, { sx: {
                            pl: 2.375,
                            py: 0.5,
                        }, children: _jsx(TokenDivider, {}) }), _jsx(Token, { token: toToken })] })] }));
};
//# sourceMappingURL=TransactionHistoryItem.js.map