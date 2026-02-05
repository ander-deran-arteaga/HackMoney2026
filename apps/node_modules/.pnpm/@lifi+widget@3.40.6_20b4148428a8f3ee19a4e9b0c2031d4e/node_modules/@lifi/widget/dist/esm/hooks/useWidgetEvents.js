import _mitt from 'mitt';
// https://github.com/developit/mitt/issues/191
const mitt = _mitt;
export const widgetEvents = mitt();
export const useWidgetEvents = () => {
    return widgetEvents;
};
//# sourceMappingURL=useWidgetEvents.js.map