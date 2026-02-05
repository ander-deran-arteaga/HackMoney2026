import type { BadgeProps } from '@mui/material';
import type { PropsWithChildren } from 'react';
interface BadgedValueProps {
    showBadge: boolean;
    badgeColor?: BadgeProps['color'];
}
export declare const BadgedValue: React.FC<PropsWithChildren<BadgedValueProps>>;
export {};
