import {Shape} from "./shape";
import {Connector, ConnectorDirection, ConnectorTipStyle, LineStyle} from "../drawers/connector";

export class ConnectorShape extends Connector implements Shape {

    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ConnectorDirection,
                lineStyle: LineStyle = LineStyle.Continuous,
                startTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                endTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat) {
        super(startRow, startColumn, endRow, endColumn, startDirection, lineStyle, startTipStyle, endTipStyle);
        this._id = id;
    }

    id(): number {
        return this._id;
    }

    editing(): boolean {
        return this._editing;
    }

    endEditing(): void {
        this._editing = false;
    }

    startEditing(): void {
        this._editing = true;
    }
}