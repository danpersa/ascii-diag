import {Tool} from "../tools/tool";
import {ConnectorTipStyle, LineStyle} from "../drawers/connector";
import {BoxCornerStyle} from "../drawers/box";
import Grid from "../drawers/grid";

export class AppState {
    private _currentTool: Tool;
    private _connectorLineStyle: LineStyle;
    private _connectorStartTipStyle: ConnectorTipStyle;
    private _connectorEndTipStyle: ConnectorTipStyle;
    private _boxCornerStyle: BoxCornerStyle;
    private _exportDialogOpen: boolean;
    private _diagramMarkup: string;
    private _grid: Grid;

    constructor(currentTool: Tool,
                connectorLineStyle: LineStyle,
                connectorStartTipStyle: ConnectorTipStyle,
                connectorEndTipStyle: ConnectorTipStyle,
                boxCornerStyle: BoxCornerStyle,
                grid: Grid,
                exportDialogOpen: boolean = false,
                diagramMarkup: string = "") {

        this._currentTool = currentTool;
        this._connectorLineStyle = connectorLineStyle;
        this._connectorStartTipStyle = connectorStartTipStyle;
        this._connectorEndTipStyle = connectorEndTipStyle;
        this._boxCornerStyle = boxCornerStyle;
        this._grid = grid;
        this._exportDialogOpen = exportDialogOpen;
        this._diagramMarkup = diagramMarkup;
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

    get exportDialogOpen(): boolean {
        return this._exportDialogOpen;
    }

    get diagramMarkup(): string {
        return this._diagramMarkup;
    }

    get grid(): Grid {
        return this._grid;
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

    set exportDialogOpen(value: boolean) {
        this._exportDialogOpen = value;
    }

    set diagramMarkup(value: string) {
        this._diagramMarkup = value;
    }

    set grid(value: Grid) {
        this._grid = value;
    }
}