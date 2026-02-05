import type { SettingsState } from './types.js';
export declare const useSettings: <K extends keyof SettingsState>(keys: Array<K>) => Pick<SettingsState, (typeof keys)[number]>;
