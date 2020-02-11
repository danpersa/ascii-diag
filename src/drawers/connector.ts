import {ConnectorShape} from "../shapes/connector-shape";

export enum ConnectorDirection {
    Horizontal,
    Vertical
}

export enum ConnectorTipDirection {
    North,
    South,
    East,
    West
}

export enum ConnectorTipStyle {
    Flat,
    Arrow
}

export enum LineStyle {
    Continuous,
    Dashed,
    Dotted
}

export class Connector {
    protected readonly _startRow: number;
    protected readonly _startColumn: number;
    protected readonly _endRow: number;
    protected readonly _endColumn: number;
    protected readonly _startDirection: ConnectorDirection;
    private readonly _lineStyle: LineStyle;
    private readonly _startTipStyle: ConnectorTipStyle;
    private readonly _endTipStyle: ConnectorTipStyle;

    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ConnectorDirection,
                lineStyle: LineStyle = LineStyle.Continuous,
                startTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                endTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat) {
        this._startRow = startRow;
        this._startColumn = startColumn;
        this._endRow = endRow;
        this._endColumn = endColumn;
        this._startDirection = startDirection;
        this._lineStyle = lineStyle;
        this._startTipStyle = startTipStyle;
        this._endTipStyle = endTipStyle;
    }

    get startRow(): number {
        return this._startRow;
    }

    get startColumn(): number {
        return this._startColumn;
    }

    get endRow(): number {
        return this._endRow;
    }

    get endColumn(): number {
        return this._endColumn;
    }

    get startDirection(): ConnectorDirection {
        return this._startDirection;
    }

    get lineStyle(): LineStyle {
        return this._lineStyle;
    }

    get startTipStyle(): ConnectorTipStyle {
        return this._startTipStyle;
    }

    get endTipStyle(): ConnectorTipStyle {
        return this._endTipStyle;
    }
}

export namespace Connector {

    export class Builder {
        protected _startRow: number;
        protected _startColumn: number;
        protected _endRow: number;
        protected _endColumn: number;
        protected _startDirection: ConnectorDirection;
        protected _lineStyle: LineStyle;
        protected _startTipStyle: ConnectorTipStyle;
        protected _endTipStyle: ConnectorTipStyle;

        protected constructor(startRow: number,
                              startColumn: number,
                              endRow: number,
                              endColumn: number,
                              startDirection: ConnectorDirection,
                              lineStyle: LineStyle,
                              startTipStyle: ConnectorTipStyle,
                              endTipStyle: ConnectorTipStyle) {
            this._startRow = startRow;
            this._startColumn = startColumn;
            this._endRow = endRow;
            this._endColumn = endColumn;
            this._startDirection = startDirection;
            this._lineStyle = lineStyle;
            this._startTipStyle = startTipStyle;
            this._endTipStyle = endTipStyle;
        }

        static from(connector: Connector): Builder {
            return new Builder(
                connector.startRow,
                connector.startColumn,
                connector.endRow,
                connector.endColumn,
                connector.startDirection,
                connector.lineStyle,
                connector.startTipStyle,
                connector.endTipStyle);
        }

        static fromShape(shape: ConnectorShape): Builder {
            return new Builder(
                shape.startRow,
                shape.startColumn,
                shape.endRow,
                shape.endColumn,
                shape.startDirection,
                shape.lineStyle,
                shape.startTipStyle,
                shape.endTipStyle);
        }

        build(): Connector {
            return new Connector(
                this._startRow,
                this._startColumn,
                this._endRow,
                this._endColumn,
                this._startDirection,
                this._lineStyle,
                this._startTipStyle,
                this._endTipStyle);
        }

        startRow(value: number) {
            this._startRow = value;
            return this;
        }

        startColumn(value: number) {
            this._startColumn = value;
            return this;
        }

        endRow(value: number) {
            this._endRow = value;
            return this;
        }

        endColumn(value: number) {
            this._endColumn = value;
            return this;
        }

        startDirection(value: ConnectorDirection) {
            this._startDirection = value;
            return this;
        }

        lineStyle(value: LineStyle) {
            this._lineStyle = value;
            return this;
        }

        startTipStyle(value: ConnectorTipStyle) {
            this._startTipStyle = value;
            return this;
        }

        endTipStyle(value: ConnectorTipStyle) {
            this._endTipStyle = value;
            return this;
        }
    }
}