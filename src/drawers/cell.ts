import Constants from '../constants'

export module Domain {
    export class Cell {
        private readonly _text: string;
        private readonly _selected: boolean;
        private readonly _canvasX: number;
        private readonly _canvasY: number;
        private readonly _row: number;
        private readonly _column: number;

        constructor(text: string, selected: boolean, canvasX: number, canvasY: number, row: number, column: number) {
            this._text = text;
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

        get text(): string {
            return this._text;
        }


        get selected(): boolean {
            return this._selected;
        }
    }

}

export module Domain.Cell {
    export class Builder {

        private _text: string = "";
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

        static from(row: number, column: number): Builder {
            return new Builder(column * Constants.densityX, row * Constants.densityY, row, column);
        }

        static fromCell(cell: Cell): Builder {
            return new Builder(cell.canvasX, cell.canvasY, cell.row, cell.column)
                .text(cell.text)
                .selected(cell.selected);
        }

        build(): Cell {
            return new Cell(this._text, this._selected, this._canvasX, this._canvasY, this._row, this._column);
        }

        column(column: number): Builder {
            this._column = column;
            return this;
        }

        row(column: number): Builder {
            this._row = column;
            return this;
        }

        canvasY(column: number): Builder {
            this._canvasY = column;
            return this;
        }

        canvasX(canvasX: number): Builder {
            this._canvasX = canvasX;
            return this;
        }

        selected(canvasX: boolean): Builder {
            this._selected = canvasX;
            return this;
        }

        text(text: string): Builder {
            this._text = text;
            return this;
        }
    }
}
