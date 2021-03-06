import {Grid} from "ascii-diag-renderer";
import {CellDrawer} from "./cell-drawer";

export interface GridDrawer {
    draw(grid: Grid): void;
}

export class CanvasGridDrawer implements GridDrawer {

    private readonly cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        this.cellDrawer = cellDrawer;
    }

    draw(grid: Grid) {
        for (let row = 0; row < grid.rows(); ++row) {
            for (let column = 0; column < grid.columns(); ++column) {
                const cell = grid.cell(row, column);
                this.cellDrawer.draw(cell);
            }
        }
    }
}
