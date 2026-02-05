import type { PropsWithChildren, ReactNode } from 'react';
import type { SettingCardTitle } from './types.js';
interface SettingCardExpandableProps extends SettingCardTitle {
    value: ReactNode;
}
export declare const SettingCardExpandable: React.FC<PropsWithChildren<SettingCardExpandableProps>>;
export {};
