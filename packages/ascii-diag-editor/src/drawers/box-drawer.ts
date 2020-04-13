import {AbstractBoxDrawer, Cell} from "ascii-diag-renderer";
import {CellDrawer} from "./cell-drawer";

export class CanvasBoxDrawer extends AbstractBoxDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        super();
        this.cellDrawer = cellDrawer;
    }

    drawCell(cell: Cell) {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayBoxDrawer extends AbstractBoxDrawer {
    private readonly _cells: Array<Cell> = [];

    drawCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}
