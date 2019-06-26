export enum ArrowDirection {
    Horizontal,
    Vertical
}

export enum ArrowTipDirection {
    North,
    South,
    East,
    West
}

export class Arrow {
    protected readonly _startRow: number;
    protected readonly _startColumn: number;
    protected readonly _endRow: number;
    protected readonly _endColumn: number;
    protected readonly _startDirection: ArrowDirection;

    constructor(startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ArrowDirection) {
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

    get startDirection(): ArrowDirection {
        return this._startDirection;
    }
}
