import { type BoxProps } from '@mui/material';
import type { GasSufficiency } from '../../hooks/useGasSufficiency.js';
interface GasSufficiencyMessageProps extends BoxProps {
    insufficientGas?: GasSufficiency[];
}
export declare const GasSufficiencyMessage: React.FC<GasSufficiencyMessageProps>;
export {};
