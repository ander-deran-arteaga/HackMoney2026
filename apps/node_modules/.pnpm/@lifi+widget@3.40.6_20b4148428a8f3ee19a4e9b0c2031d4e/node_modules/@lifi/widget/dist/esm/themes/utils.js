export const getStyleOverrides = (componentName, styleOverrideProp, theme, ownerState) => {
    const component = theme.components?.[componentName];
    const property = component?.styleOverrides?.[styleOverrideProp];
    if (typeof property === 'function') {
        return property({ theme, ownerState });
    }
    return property;
};
//# sourceMappingURL=utils.js.map