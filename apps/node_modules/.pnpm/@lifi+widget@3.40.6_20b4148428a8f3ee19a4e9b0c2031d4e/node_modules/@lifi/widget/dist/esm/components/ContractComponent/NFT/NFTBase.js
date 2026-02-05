import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Link, Skeleton, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Token } from '../../Token/Token.js';
import { PreviewAvatar } from './NFT.style.js';
export const NFTBase = ({ imageUrl, isLoading, collectionName, assetName, owner, token, }) => {
    const { t } = useTranslation();
    return (_jsxs(Box, { sx: {
            p: 2,
        }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                }, children: [isLoading ? (_jsx(Skeleton, { width: 96, height: 96, variant: "rectangular", sx: { borderRadius: 1 } })) : (_jsx(PreviewAvatar, { src: imageUrl })), _jsxs(Box, { sx: {
                            ml: 2,
                        }, children: [isLoading ? (_jsx(Skeleton, { width: 144, height: 21, variant: "text" })) : (_jsx(Typography, { sx: {
                                    fontSize: 14,
                                    color: 'text.secondary',
                                }, children: collectionName })), isLoading ? (_jsx(Skeleton, { width: 112, height: 27, variant: "text" })) : (_jsx(Typography, { sx: {
                                    fontSize: 18,
                                    fontWeight: 600,
                                }, children: assetName })), isLoading ? (_jsx(Skeleton, { width: 128, height: 21, variant: "text" })) : owner ? (_jsxs(Typography, { sx: {
                                    fontSize: 14,
                                    color: 'text.secondary',
                                }, children: [t('main.ownedBy'), ' ', _jsx(Link, { href: owner.url, target: "_blank", underline: "none", color: "primary", children: owner.name })] })) : null] })] }), _jsx(Token, { token: token, isLoading: isLoading, mt: 2 })] }));
};
//# sourceMappingURL=NFTBase.js.map