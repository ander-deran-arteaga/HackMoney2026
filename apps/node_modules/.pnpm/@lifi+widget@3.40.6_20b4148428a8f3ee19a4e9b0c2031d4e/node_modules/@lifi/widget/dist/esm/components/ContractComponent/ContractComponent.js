import { jsx as _jsx } from "react/jsx-runtime";
import { Card } from '../Card/Card.js';
export const ContractComponent = ({ children, ...props }) => {
    if (!children) {
        return null;
    }
    return _jsx(Card, { ...props, children: children });
};
//# sourceMappingURL=ContractComponent.js.map