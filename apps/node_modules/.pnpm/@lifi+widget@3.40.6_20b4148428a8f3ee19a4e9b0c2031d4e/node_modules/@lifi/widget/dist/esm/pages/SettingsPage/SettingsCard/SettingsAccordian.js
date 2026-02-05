import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useId, useState } from 'react';
const SettingsAccordionContext = createContext({
    setOpenCard: (_id) => { },
    openCard: '',
});
export const SettingsCardAccordion = ({ children, }) => {
    const [openCard, setOpenCard] = useState('');
    return (_jsx(SettingsAccordionContext.Provider, { value: { openCard, setOpenCard }, children: children }));
};
export const useSettingsCardExpandable = () => {
    const settingCardExpandableId = useId();
    const [expanded, setExpanded] = useState(false);
    const { openCard, setOpenCard } = useContext(SettingsAccordionContext);
    const toggleExpanded = () => {
        const newExpanded = !expanded;
        setExpanded(newExpanded);
        if (newExpanded && openCard !== settingCardExpandableId) {
            setOpenCard(settingCardExpandableId);
        }
    };
    useEffect(() => {
        if (openCard !== settingCardExpandableId) {
            setExpanded(false);
        }
    }, [settingCardExpandableId, openCard]);
    return {
        expanded,
        toggleExpanded,
    };
};
//# sourceMappingURL=SettingsAccordian.js.map