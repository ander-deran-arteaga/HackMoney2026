export interface WidgetDrawerContext {
    closeDrawer?(): void;
}
export declare const DrawerContext: import("react").Context<WidgetDrawerContext>;
export declare const useDrawer: () => WidgetDrawerContext;
