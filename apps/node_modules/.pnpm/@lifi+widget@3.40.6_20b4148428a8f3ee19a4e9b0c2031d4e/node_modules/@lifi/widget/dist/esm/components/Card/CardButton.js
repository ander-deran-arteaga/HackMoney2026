import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from './Card.js';
import { CardRowButton, CardTitleContainer, CardValue, } from './CardButton.style.js';
export const CardButton = ({ onClick, icon, title, children }) => (_jsx(Card, { children: _jsxs(CardRowButton, { onClick: onClick, disableRipple: true, children: [_jsxs(CardTitleContainer, { children: [icon, _jsx(CardValue, { children: title })] }), children] }) }));
//# sourceMappingURL=CardButton.js.map