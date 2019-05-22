export enum ArrowDirection {
    Horizontal,
    Vertical
}


export class Arrow {
    private readonly _startRow: number;
    private readonly _startColumn: number;
    private readonly _endRow: number;
    private readonly _endColumn: number;
    private readonly _startDirection: ArrowDirection;

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
