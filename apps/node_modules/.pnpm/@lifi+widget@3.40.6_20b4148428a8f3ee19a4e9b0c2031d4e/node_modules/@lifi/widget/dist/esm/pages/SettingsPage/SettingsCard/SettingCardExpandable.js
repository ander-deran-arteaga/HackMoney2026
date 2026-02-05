import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Collapse } from '@mui/material';
import { useId } from 'react';
import { Card } from '../../../components/Card/Card.js';
import { CardRowButton, CardTitleContainer, CardValue, } from '../../../components/Card/CardButton.style.js';
import { useSettingsCardExpandable } from './SettingsAccordian.js';
export const SettingCardExpandable = ({ icon, title, value, children }) => {
    const { expanded, toggleExpanded } = useSettingsCardExpandable();
    const buttonId = useId();
    const collapseId = useId();
    return (_jsxs(Card, { sx: { p: 1 }, children: [_jsxs(CardRowButton, { id: buttonId, "aria-expanded": expanded, "aria-controls": collapseId, onClick: toggleExpanded, disableRipple: true, sx: { p: 1 }, children: [_jsxs(CardTitleContainer, { children: [icon, _jsx(CardValue, { children: title })] }), !expanded && value] }), _jsx(Collapse, { id: collapseId, role: "region", "aria-labelledby": buttonId, in: expanded, children: children })] }));
};
//# sourceMappingURL=SettingCardExpandable.js.map