import type { WidgetTheme, WidgetThemeComponents } from '../types/widget.js';
type ComponentName = keyof WidgetThemeComponents;
export declare const getStyleOverrides: (componentName: ComponentName, styleOverrideProp: string, theme: WidgetTheme, ownerState?: any) => any;
export {};
