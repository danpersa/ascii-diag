import {AbstractConnectorDrawer, Cell} from "ascii-diag-renderer";
import {CellDrawer} from "./cell-drawer";

export class CanvasConnectorDrawer extends AbstractConnectorDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        super();
        this.cellDrawer = cellDrawer;
    }

    drawCell(cell: Cell) {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayConnectorDrawer extends AbstractConnectorDrawer {
    private readonly _cells: Array<Cell> = [];

    drawCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}
