import {CellDrawer} from "./cell-drawer";
import Grid from "./grid";
import Constants from "../constants";

export class GridDrawer {

    private readonly cellDrawer: CellDrawer;
    private readonly grid: Grid;

    constructor(grid: Grid, cellDrawer: CellDrawer) {
        this.cellDrawer = cellDrawer;
        this.grid = grid;
    }

    draw() {
        for (let row = 0; row < Constants.numberOfRows; ++row) {
            for (let column = 0; column < Constants.numberOfColumns; ++column) {
                const cell = this.grid.cell(row, column);
                this.cellDrawer.draw(cell);
            }
        }
    }
}

