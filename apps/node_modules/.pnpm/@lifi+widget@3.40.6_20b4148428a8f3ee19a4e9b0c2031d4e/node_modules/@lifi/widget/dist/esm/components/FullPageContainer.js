import { jsx as _jsx } from "react/jsx-runtime";
import { styled } from '@mui/material';
import { PageContainer } from './PageContainer.js';
// In max height and default layout
// the PageContainer collapses to use the minimum space need to display its child components whereas
// the FullPageContainer expands and fills the available vertical space provide by the max-height
// See the CssBaselineContainer component styles in AppContainer.tsx for usage of full-page-container
export const FullPageContainer = styled((props) => (_jsx(PageContainer, { ...props, className: `${props.className} full-page-container` }))) ``;
//# sourceMappingURL=FullPageContainer.js.map