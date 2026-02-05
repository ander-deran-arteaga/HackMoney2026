export const calculateValueLossPercentage = (fromAmountUSD, toAmountUSD, gasCostUSD, feeCostUSD) => {
    return Number.parseFloat(((toAmountUSD / (fromAmountUSD + gasCostUSD + feeCostUSD) - 1) *
        100).toFixed(2));
};
export const getTokenValueLossThreshold = (fromAmountUSD, toAmountUSD, gasCostUSD, feeCostUSD) => {
    if (!fromAmountUSD || !toAmountUSD) {
        return false;
    }
    return toAmountUSD / (fromAmountUSD + gasCostUSD + feeCostUSD) < 0.9;
};
//# sourceMappingURL=utils.js.map