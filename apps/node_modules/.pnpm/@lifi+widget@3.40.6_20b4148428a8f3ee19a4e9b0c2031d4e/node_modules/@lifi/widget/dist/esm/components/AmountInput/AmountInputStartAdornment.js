import { jsx as _jsx } from "react/jsx-runtime";
import { useChain } from '../../hooks/useChain.js';
import { useToken } from '../../hooks/useToken.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { AvatarBadgedDefault } from '../Avatar/Avatar.js';
import { TokenAvatar } from '../Avatar/TokenAvatar.js';
export const AmountInputStartAdornment = ({ formType, }) => {
    const [chainId, tokenAddress] = useFieldValues(FormKeyHelper.getChainKey(formType), FormKeyHelper.getTokenKey(formType));
    const { chain } = useChain(chainId);
    const { token } = useToken(chainId, tokenAddress);
    const isSelected = !!(chain && token);
    return isSelected ? (_jsx(TokenAvatar, { token: token, chain: chain })) : (_jsx(AvatarBadgedDefault, {}));
};
//# sourceMappingURL=AmountInputStartAdornment.js.map