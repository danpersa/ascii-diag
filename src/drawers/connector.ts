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
