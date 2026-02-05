import { jsx as _jsx } from "react/jsx-runtime";
import { CardValue } from '../../../components/Card/CardButton.style.js';
import { Badge } from './SettingCard.style.js';
export const BadgedValue = ({ showBadge, badgeColor, children, }) => showBadge && badgeColor ? (_jsx(Badge, { variant: "dot", color: badgeColor, children: _jsx(CardValue, { children: children }) })) : (_jsx(CardValue, { children: children }));
//# sourceMappingURL=BadgedValue.js.map