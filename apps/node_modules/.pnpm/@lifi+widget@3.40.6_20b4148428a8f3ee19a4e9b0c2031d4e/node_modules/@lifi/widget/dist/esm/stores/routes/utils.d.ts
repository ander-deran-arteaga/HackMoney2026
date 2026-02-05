import type { Process, RouteExtended } from '@lifi/sdk';
export declare const isRouteDone: (route: RouteExtended) => boolean;
export declare const isRoutePartiallyDone: (route: RouteExtended) => boolean;
export declare const isRouteRefunded: (route: RouteExtended) => boolean;
export declare const isRouteFailed: (route: RouteExtended) => boolean;
export declare const isRouteActive: (route?: RouteExtended) => boolean;
export declare const getUpdatedProcess: (currentRoute: RouteExtended, updatedRoute: RouteExtended) => Process | undefined;
export declare const getSourceTxHash: (route?: RouteExtended) => string | undefined;
