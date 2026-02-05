import { jsx as _jsx } from "react/jsx-runtime";
import { Divider } from '@mui/material';
import { Container } from './StepDivider.style.js';
export const StepDivider = () => {
    return (_jsx(Container, { children: _jsx(Divider, { orientation: "vertical", flexItem: true }) }));
};
//# sourceMappingURL=StepDivider.js.map