import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
interface ConfirmToAddressSheetProps {
    onContinue: () => void;
    toAddress: string;
    toChainId: number;
}
export declare const ConfirmToAddressSheet: import("react").ForwardRefExoticComponent<ConfirmToAddressSheetProps & import("react").RefAttributes<BottomSheetBase>>;
export {};
