export const currencyExtendedFormatter = (lng, options) => {
    const formatter = new Intl.NumberFormat(lng, {
        ...options,
        style: 'currency',
    });
    return (value) => {
        if (value > 0 && value < 0.01) {
            return `<${formatter.format(0.01)}`;
        }
        return formatter.format(value);
    };
};
//# sourceMappingURL=currencyExtendedFormatter.js.map