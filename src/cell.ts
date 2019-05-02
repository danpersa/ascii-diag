namespace Domain {

    export class Cell {
        private readonly _value: string;
        private readonly _selected: boolean;
        private readonly _canvasX: number;
        private readonly _canvasY: number;
        private readonly _row: number;
        private readonly _column: number;

        constructor(value: string, selected: boolean, canvasX: number, canvasY: number, row: number, column: number) {
            this._value = value;
            this._selected = selected;
            this._canvasX = canvasX;
            this._canvasY = canvasY;
            this._row = row;
            this._column = column;
        }

        get canvasY(): number {
            return this._canvasY;
        }

        get canvasX(): number {
            return this._canvasX;
        }

        get row(): number {
            return this._row;
        }

        get column(): number {
            return this._column;
        }

        get value(): string {
            return this._value;
        }


        get selected(): boolean {
            return this._selected;
        }
    }

}

namespace Domain.Cell {
    export class Builder {

        private _value: string = "";
        private _selected: boolean = false;
        private _canvasX: number;
        private _canvasY: number;
        private _row: number;
        private _column: number;

        private constructor(canvasX: number, canvasY: number, row: number, column: number) {
            this._canvasX = canvasX;
            this._canvasY = canvasY;
            this._row = row;
            this._column = column;
        }

        static from(canvasX: number, canvasY: number, row: number, column: number): Builder {
            return new Builder(canvasX, canvasY, row, column);
        }

        static fromCell(cell: Cell): Builder {
            return new Builder(cell.canvasX, cell.canvasY, cell.row, cell.column)
                .value(cell.value)
                .selected(cell.selected);
        }

        build(): Cell {
            return new Cell(this._value, this._selected, this._canvasX, this._canvasY, this._row, this._column);
        }

        column(value: number): Builder {
            this._column = value;
            return this;
        }

        row(value: number): Builder {
            this._row = value;
            return this;
        }

        canvasY(value: number): Builder {
            this._canvasY = value;
            return this;
        }

        canvasX(value: number): Builder {
            this._canvasX = value;
            return this;
        }

        selected(value: boolean): Builder {
            this._selected = value;
            return this;
        }

        value(value: string): Builder {
            this._value = value;
            return this;
        }
    }
}
