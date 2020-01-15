import {Domain} from "../drawers/cell";
import {Shape} from "./shape";
import {ArrayBoxDrawer} from "../drawers/box-drawer";
import {Box} from "../drawers/box";
import Cell = Domain.Cell;

export class BoxShape extends Box implements Shape {
    private readonly _id: number;
    private readonly _cells: Array<Cell>;
    private _editing: boolean = false;

    constructor(id: number, topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        super(topRow, leftColumn, bottomRow, rightColumn);
        this._id = id;
        this._cells = [];

        const boxDrawer = new ArrayBoxDrawer();
        boxDrawer.draw(new Box(topRow, leftColumn, bottomRow, rightColumn));
        this._cells = boxDrawer.cells;
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
