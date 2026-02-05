import type { BottomSheetBase } from '../../components/BottomSheet/types.js';
import type { Bookmark } from '../../stores/bookmarks/types.js';
interface BookmarkAddressProps {
    onAddBookmark: (bookmark: Bookmark) => void;
    validatedWallet?: Bookmark;
}
export declare const BookmarkAddressSheet: import("react").ForwardRefExoticComponent<BookmarkAddressProps & import("react").RefAttributes<BottomSheetBase>>;
export {};
