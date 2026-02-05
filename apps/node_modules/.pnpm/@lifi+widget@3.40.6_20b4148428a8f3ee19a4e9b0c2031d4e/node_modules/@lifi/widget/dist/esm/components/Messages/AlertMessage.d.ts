import type { BoxProps } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';
import type { Severity } from './types.js';
interface AlertMessageProps extends PropsWithChildren<Omit<BoxProps, 'title'>> {
    icon: ReactNode;
    title: ReactNode;
    multiline?: boolean;
    severity?: Severity;
}
export declare const AlertMessage: ({ title, icon, children, multiline, severity, ...rest }: AlertMessageProps) => import("react/jsx-runtime").JSX.Element;
export {};
