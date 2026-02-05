import type { MouseEventHandler, PropsWithChildren } from 'react';
import type { SettingCardTitle } from '../../pages/SettingsPage/SettingsCard/types.js';
interface SettingCardButtonProps extends SettingCardTitle {
    onClick: MouseEventHandler;
}
export declare const CardButton: React.FC<PropsWithChildren<SettingCardButtonProps>>;
export {};
