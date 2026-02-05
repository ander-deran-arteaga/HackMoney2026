import { useRouteExecutionStore } from './RouteExecutionStore.js';
export const useSetExecutableRoute = () => {
    return useRouteExecutionStore((state) => state.setExecutableRoute);
};
//# sourceMappingURL=useSetExecutableRoute.js.map