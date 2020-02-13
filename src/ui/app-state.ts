import {Tool} from "../tools/tool";
import {ConnectorTipStyle, LineStyle} from "../drawers/connector";
import {BoxCornerStyle} from "../drawers/box";

export class AppState {
    private _currentTool: Tool;
    private _connectorLineStyle: LineStyle;
    private _connectorStartTipStyle: ConnectorTipStyle;
    private _connectorEndTipStyle: ConnectorTipStyle;
    private _boxCornerStyle: BoxCornerStyle;

    constructor(currentTool: Tool,
                connectorLineStyle: LineStyle,
                connectorStartTipStyle: ConnectorTipStyle,
                connectorEndTipStyle: ConnectorTipStyle,
                boxCornerStyle: BoxCornerStyle) {

        this._currentTool = currentTool;
        this._connectorLineStyle = connectorLineStyle;
        this._connectorStartTipStyle = connectorStartTipStyle;
        this._connectorEndTipStyle = connectorEndTipStyle;
        this._boxCornerStyle = boxCornerStyle;
    }

    get currentTool(): Tool {
        return this._currentTool;
    }

    get connectorLineStyle(): LineStyle {
        return this._connectorLineStyle;
    }

    get connectorStartTipStyle(): ConnectorTipStyle {
        return this._connectorStartTipStyle;
    }

    get connectorEndTipStyle(): ConnectorTipStyle {
        return this._connectorEndTipStyle;
    }

    get boxCornerStyle(): BoxCornerStyle {
        return this._boxCornerStyle;
    }

    set currentTool(value: Tool) {
        this._currentTool = value;
    }

    set connectorLineStyle(value: LineStyle) {
        this._connectorLineStyle = value;
    }

    set connectorStartTipStyle(value: ConnectorTipStyle) {
        this._connectorStartTipStyle = value;
    }

    set connectorEndTipStyle(value: ConnectorTipStyle) {
        this._connectorEndTipStyle = value;
    }

    set boxCornerStyle(value: BoxCornerStyle) {
        this._boxCornerStyle = value;
    }
}