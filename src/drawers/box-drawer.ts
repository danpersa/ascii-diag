import {Box} from "./box";
import {CellDrawer} from "./cell-drawer";
import {Domain} from "./cell";
import {Drawer} from "./drawer";
import Grid from "./grid";
import Cell = Domain.Cell;

export interface BoxDrawer extends Drawer<Box> {
}

export abstract class AbstractBoxDrawer implements BoxDrawer {

    abstract addCell(cell: Cell): void;

    draw(box: Box): void {
        const minRow = box.topRow;
        const maxRow = box.bottomRow;
        const minColumn = box.leftColumn;
        const maxColumn = box.rightColumn;

        // start corner
        let cell = Cell.Builder.from(box.topRow, box.leftColumn).text("+").build();
        this.addCell(cell);

        // horizontal edge
        for (let i = minColumn + 1; i < maxColumn; i++) {
            let cell = Cell.Builder.from(box.topRow, i).text("-").build();
            this.addCell(cell);
        }

        // left edge
        for (let i = minRow + 1; i < maxRow; i++) {
            let cell = Cell.Builder.from(i, box.leftColumn).text("|").build();
            this.addCell(cell);
        }

        if (minColumn != maxColumn) {
            for (let i = minRow + 1; i < maxRow; i++) {
                // right edge
                let cell = Cell.Builder.from(i, box.rightColumn).text("|").build();
                this.addCell(cell);
            }

            // top right corner
            let cell = Cell.Builder.from(box.topRow, box.rightColumn).text("+").build();
            this.addCell(cell);
        }

        if (minRow != maxRow) {
            // bottom edge
            for (let i = minColumn + 1; i < maxColumn; i++) {
                let cell = Cell.Builder.from(box.bottomRow, i).text("-").build();
                this.addCell(cell);
            }

            // bottom left corner
            let cell = Cell.Builder.from(box.bottomRow, box.leftColumn).text("+").build();
            this.addCell(cell);
        }

        if (minRow != maxRow && minColumn != maxColumn) {
            // bottom right corner
            let cell = Cell.Builder.from(box.bottomRow, box.rightColumn).text("+").build();
            this.addCell(cell);
        }
    }
}

export class CanvasBoxDrawer extends AbstractBoxDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        super();
        this.cellDrawer = cellDrawer;
    }

    addCell(cell: Cell) {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayBoxDrawer extends AbstractBoxDrawer {
    private readonly _cells: Array<Cell> = [];

    addCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}

export class GridBoxDrawer extends AbstractBoxDrawer {
    private readonly grid: Grid;

    constructor(grid: Grid) {
        super();
        this.grid = grid;
    }

    addCell(cell: Cell): void {
        this.grid.setTextForCell(cell.row, cell.column, cell.text);
    }
}
