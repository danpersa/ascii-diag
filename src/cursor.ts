export class Cursor {
    private readonly _row: number;
    private readonly _column: number;

    static fromGrid(row: number, column: number): Cursor {
        return new Cursor(row, column);
    }

    private constructor(row: number, column: number) {
        this._row = row;
        this._column = column;
    }

    get row(): number {
        return this._row;
    }

    get column(): number {
        return this._column;
    }
}
