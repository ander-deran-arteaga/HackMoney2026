import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import type { Bookmark } from '../../stores/bookmarks/types.js';
interface ConfirmAddressSheetProps {
    onConfirm: (wallet: Bookmark) => void;
    validatedBookmark?: Bookmark;
}
export declare const ConfirmAddressSheet: import("react").ForwardRefExoticComponent<ConfirmAddressSheetProps & import("react").RefAttributes<BottomSheetBase>>;
export {};
