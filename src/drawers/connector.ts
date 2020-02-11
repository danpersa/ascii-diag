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

export enum ConnectorTipType {
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

    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ConnectorDirection) {
        this._startRow = startRow;
        this._startColumn = startColumn;
        this._endRow = endRow;
        this._endColumn = endColumn;
        this._startDirection = startDirection;
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
}
