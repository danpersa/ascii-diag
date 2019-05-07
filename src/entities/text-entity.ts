import {Domain} from "../cell";
import Cell = Domain.Cell;
import {Entity} from "./entity";

export class TextEntity implements Entity {
    private readonly _row: number;
    private readonly _column: number;
    private readonly _text: string;
    private readonly _cells: Array<Cell>;

    constructor(row: number, column: number, text: string) {
        this._row = row;
        this._column = column;
        this._text = text;
        this._cells = [];
        for (let i = 0; i < this.text.length; ++i) {
            const cellValue = this.text.charAt(i);
            const cell = Cell.Builder.from(this.row, this.column + i)
                .value(cellValue)
                .build();
            this._cells.push(cell);
        }
    }

    get text(): string {
        return this._text;
    }

    get column(): number {
        return this._column;
    }

    get row(): number {
        return this._row;
    }

    cells(): Array<Domain.Cell> {
        return this._cells;
    }
}
