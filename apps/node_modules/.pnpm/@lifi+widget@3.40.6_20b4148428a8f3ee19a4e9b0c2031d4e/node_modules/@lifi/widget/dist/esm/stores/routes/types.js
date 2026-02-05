export var RouteExecutionStatus;
(function (RouteExecutionStatus) {
    RouteExecutionStatus[RouteExecutionStatus["Idle"] = 1] = "Idle";
    RouteExecutionStatus[RouteExecutionStatus["Pending"] = 2] = "Pending";
    RouteExecutionStatus[RouteExecutionStatus["Done"] = 4] = "Done";
    RouteExecutionStatus[RouteExecutionStatus["Failed"] = 8] = "Failed";
    RouteExecutionStatus[RouteExecutionStatus["Partial"] = 16] = "Partial";
    RouteExecutionStatus[RouteExecutionStatus["Refunded"] = 32] = "Refunded";
})(RouteExecutionStatus || (RouteExecutionStatus = {}));
//# sourceMappingURL=types.js.map