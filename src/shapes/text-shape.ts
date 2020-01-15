import {Domain} from "../drawers/cell";
import Cell = Domain.Cell;
import {Shape} from "./shape";
import {Text} from "../drawers/text";

export class TextShape extends Text implements Shape {
    private readonly _id: number;
    private readonly _cells: Array<Cell>;
    private _editing: boolean = false;

    constructor(id: number, row: number, column: number, text: string) {
        super(row, column, text);
        this._id = id;
        this._cells = [];
        for (let i = 0; i < this.text.length; ++i) {
            const cellValue = this.text.charAt(i);
            const cell = Cell.Builder.from(this.row, this.column + i)
                .text(cellValue)
                .build();
            this._cells.push(cell);
        }
    }

    id(): number {
        return this._id;
    }

    cells(): Array<Domain.Cell> {
        return this._cells;
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
