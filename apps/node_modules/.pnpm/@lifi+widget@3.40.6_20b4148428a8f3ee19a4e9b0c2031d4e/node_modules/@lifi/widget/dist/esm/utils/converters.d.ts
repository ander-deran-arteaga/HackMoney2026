import type { FullStatusData, ToolsResponse } from '@lifi/sdk';
import type { RouteExecution } from '../stores/routes/types.js';
export declare const buildRouteFromTxHistory: (tx: FullStatusData, tools?: ToolsResponse) => RouteExecution | undefined;
