import {Box} from "./box";
import {CellDrawer} from "./cell-drawer";
import {Domain} from "./cell";
import Cell = Domain.Cell;


export class BoxDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        this.cellDrawer = cellDrawer;
    }

    draw(box: Box): void {
        const minRow = box.topRow;
        const maxRow = box.bottomRow;
        const minColumn = box.leftColumn;
        const maxColumn = box.rightColumn;

        // start corner
        let cell = Cell.Builder.from(box.topRow, box.leftColumn).value("+").build();
        this.cellDrawer.draw(cell);

        // horizontal edge
        for (let i = minColumn + 1; i < maxColumn; i++) {
            let cell = Cell.Builder.from(box.topRow, i).value("-").build();
            this.cellDrawer.draw(cell);
        }

        // left edge
        for (let i = minRow + 1; i < maxRow; i++) {
            let cell = Cell.Builder.from(i, box.leftColumn).value("|").build();
            this.cellDrawer.draw(cell);
        }

        if (minColumn != maxColumn) {
            for (let i = minRow + 1; i < maxRow; i++) {
                // right edge
                let cell = Cell.Builder.from(i, box.rightColumn).value("|").build();
                this.cellDrawer.draw(cell);
            }

            // top right corner
            let cell = Cell.Builder.from(box.topRow, box.rightColumn).value("+").build();
            this.cellDrawer.draw(cell);
        }

        if (minRow != maxRow) {
            // bottom edge
            for (let i = minColumn + 1; i < maxColumn; i++) {
                let cell = Cell.Builder.from(box.bottomRow, i).value("-").build();
                this.cellDrawer.draw(cell);
            }

            // bottom left corner
            let cell = Cell.Builder.from(box.bottomRow, box.leftColumn).value("+").build();
            this.cellDrawer.draw(cell);
        }

        if (minRow != maxRow && minColumn != maxColumn) {
            // bottom right corner
            let cell = Cell.Builder.from(box.bottomRow, box.rightColumn).value("+").build();
            this.cellDrawer.draw(cell);
        }
    }
}
