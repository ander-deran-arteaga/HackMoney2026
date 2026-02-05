import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Skeleton } from '@mui/material';
import { Card } from '../../components/Card/Card.js';
import { PageContainer } from '../../components/PageContainer.js';
import { TokenSkeleton } from '../../components/Token/Token.js';
export const TransactionDetailsSkeleton = () => {
    return (_jsxs(PageContainer, { children: [_jsxs(Box, { sx: {
                    pb: 1,
                    pt: 0.75,
                    display: 'flex',
                    flex: 1,
                    justifyContent: 'space-between',
                }, children: [_jsx(Skeleton, { width: 96, height: 20, variant: "text" }), _jsx(Skeleton, { width: 40, height: 20, variant: "text" })] }), _jsxs(Card, { sx: { paddingX: 2, marginBottom: 3 }, children: [_jsx(Box, { sx: {
                            pt: 2.5,
                        }, children: _jsx(Skeleton, { width: 64, height: 12, variant: "rounded" }) }), _jsxs(Box, { sx: {
                            py: 1,
                        }, children: [_jsx(Box, { sx: {
                                    py: 1,
                                }, children: _jsx(TokenSkeleton, {}) }), _jsx(Box, { sx: {
                                    py: 1,
                                }, children: _jsx(TokenSkeleton, { disableDescription: true }) }), Array.from({ length: 3 }).map((_, key) => (_jsxs(Box, { sx: {
                                    py: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                }, children: [_jsx(Skeleton, { variant: "rounded", width: 40, height: 40, sx: {
                                            borderRadius: '100%',
                                        } }), _jsx(Skeleton, { sx: {
                                            ml: 2,
                                        }, width: 96, height: 24, variant: "text" })] }, key))), _jsx(Box, { sx: {
                                    py: 1,
                                }, children: _jsx(TokenSkeleton, {}) })] })] })] }));
};
//# sourceMappingURL=TransactionDetailsSkeleton.js.map