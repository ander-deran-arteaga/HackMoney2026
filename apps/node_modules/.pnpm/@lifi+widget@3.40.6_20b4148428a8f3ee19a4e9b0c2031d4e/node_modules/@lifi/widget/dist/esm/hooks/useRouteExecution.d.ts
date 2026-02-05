import type { ExchangeRateUpdateParams } from '@lifi/sdk';
interface RouteExecutionProps {
    routeId: string;
    executeInBackground?: boolean;
    onAcceptExchangeRateUpdate?(resolver: (value: boolean) => void, data: ExchangeRateUpdateParams): void;
}
export declare const useRouteExecution: ({ routeId, executeInBackground, onAcceptExchangeRateUpdate, }: RouteExecutionProps) => {
    executeRoute: () => void;
    restartRoute: () => void;
    deleteRoute: () => void;
    route: import("@lifi/sdk").RouteExtended | undefined;
    status: import("../stores/routes/types.js").RouteExecutionStatus | undefined;
};
export {};
