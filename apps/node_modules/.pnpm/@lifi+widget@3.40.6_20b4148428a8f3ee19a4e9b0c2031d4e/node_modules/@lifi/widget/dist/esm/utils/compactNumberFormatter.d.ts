/**
 * Formats numbers with special handling for small decimal values, converting runs of leading zeros
 * into a more compact subscript notation.
 *
 * @param value - The numeric value to format (expected to be a string representing a BigInt)
 * @param lng - The locale string for number formatting
 * @param options - Formatting options including decimals and Intl.NumberFormat options
 * @returns A formatted string with subscript notation for leading zeros
 */
export declare const compactNumberFormatter: (lng: string | undefined, options: any) => (value: any) => string;
