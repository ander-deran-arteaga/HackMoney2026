export var ElementId;
(function (ElementId) {
    ElementId["AppExpandedContainer"] = "widget-app-expanded-container";
    ElementId["Header"] = "widget-header";
    ElementId["RelativeContainer"] = "widget-relative-container";
    ElementId["ScrollableContainer"] = "widget-scrollable-container";
})(ElementId || (ElementId = {}));
export const createElementId = (ElementId, elementId) => elementId ? `${ElementId}-${elementId}` : ElementId;
// NOTE: The getter functions here are often used with code that can be effected by css changes in the
//   AppExpandedContainer, RelativeContainer and CssBaselineContainer components as defined in AppContainer.ts
export const getAppContainer = (elementId) => document.getElementById(createElementId(ElementId.AppExpandedContainer, elementId));
export const getRelativeContainer = (elementId) => document.getElementById(createElementId(ElementId.RelativeContainer, elementId));
export const getScrollableContainer = (elementId) => document.getElementById(createElementId(ElementId.ScrollableContainer, elementId));
export const getHeaderElement = (elementId) => document.getElementById(createElementId(ElementId.Header, elementId));
//# sourceMappingURL=elements.js.map