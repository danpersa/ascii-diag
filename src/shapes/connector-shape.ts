import {Shape} from "./shape";
import {Connector, ConnectorDirection, ConnectorTipStyle, LineStyle} from "../drawers/connector";

export class ConnectorShape extends Connector implements Shape {

    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number,
                startRow: number,
                startColumn: number,
                endRow: number,
                endColumn: number,
                startDirection: ConnectorDirection,
                lineStyle: LineStyle = LineStyle.Continuous,
                startTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                endTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                editing: boolean = false) {

        super(startRow, startColumn, endRow, endColumn, startDirection, lineStyle, startTipStyle, endTipStyle);
        this._id = id;
        this._editing = editing;
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

export namespace ConnectorShape {
    export class ShapeBuilder extends Connector.Builder {
        protected _id: number;
        protected _editing: boolean = false;

        protected constructor(id: number,
                              startRow: number,
                              startColumn: number,
                              endRow: number,
                              endColumn: number,
                              startDirection: ConnectorDirection,
                              lineStyle: LineStyle,
                              startTipStyle: ConnectorTipStyle,
                              endTipStyle: ConnectorTipStyle,
                              editing: boolean = false) {
            super(startRow, startColumn, endRow, endColumn, startDirection, lineStyle, startTipStyle, endTipStyle);
            this._id = id;
            this._editing = editing;
        }

        static from(connectorShape: ConnectorShape): ShapeBuilder {
            return new ShapeBuilder(
                connectorShape.id(),
                connectorShape.startRow,
                connectorShape.startColumn,
                connectorShape.endRow,
                connectorShape.endColumn,
                connectorShape.startDirection,
                connectorShape.lineStyle,
                connectorShape.startTipStyle,
                connectorShape.endTipStyle,
                connectorShape.editing());
        }

        build(): ConnectorShape {
            return new ConnectorShape(
                this._id,
                this._startRow,
                this._startColumn,
                this._endRow,
                this._endColumn,
                this._startDirection,
                this._lineStyle,
                this._startTipStyle,
                this._endTipStyle,
                this._editing);
        }

        id(value: number) {
            this._id = value;
            return this;
        }

        editing(value: boolean) {
            this._editing = value;
            return this;
        }
    }
}
