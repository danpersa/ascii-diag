import {CellDrawer} from "./cell-drawer";
import {Cell} from "ascii-diag-renderer";
import {AbstractTextDrawer} from "ascii-diag-renderer";

export class CanvasTextDrawer extends AbstractTextDrawer {
    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        super();
        this.cellDrawer = cellDrawer;
    }

    drawCell(cell: Cell): void {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayTextDrawer extends AbstractTextDrawer {
    private readonly _cells: Array<Cell> = [];

    drawCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}
