/**
 * We use <0.01% for both small positive and negative changes to keep it simple and clear, focusing on minimal impact rather than direction.
 * Examples:
 * +0.007% -> <0.01%
 * -0.003% -> <0.01%
 */
export declare const percentFormatter: (lng: string | undefined, options: any) => (value: any) => string;
