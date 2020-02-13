import {Box, BoxCornerStyle} from "./box";
import {CellDrawer} from "./cell-drawer";
import {Domain} from "./cell";
import {Drawer} from "./drawer";
import Grid from "./grid";
import Cell = Domain.Cell;

export interface BoxDrawer extends Drawer<Box> {
}

export abstract class AbstractBoxDrawer implements BoxDrawer {

    abstract drawCell(cell: Cell): void;

    draw(box: Box): void {
        const minRow = box.topRow;
        const maxRow = box.bottomRow;
        const minColumn = box.leftColumn;
        const maxColumn = box.rightColumn;

        const topLeftCornerSymbol = this.topLeftCornerSymbol(box.cornerStyle);
        const topRightCornerSymbol = this.topRightCornerSymbol(box.cornerStyle);
        const bottomLeftCornerSymbol = this.bottomLeftCornerSymbol(box.cornerStyle);
        const bottomRightCornerSymbol = this.bottomRightCornerSymbol(box.cornerStyle);

        // start corner
        let cell = Cell.Builder.from(box.topRow, box.leftColumn).text(topLeftCornerSymbol).build();
        this.drawCell(cell);

        // horizontal edge
        for (let i = minColumn + 1; i < maxColumn; i++) {
            let cell = Cell.Builder.from(box.topRow, i).text("-").build();
            this.drawCell(cell);
        }

        // left edge
        for (let i = minRow + 1; i < maxRow; i++) {
            let cell = Cell.Builder.from(i, box.leftColumn).text("|").build();
            this.drawCell(cell);
        }

        if (minColumn != maxColumn) {
            for (let i = minRow + 1; i < maxRow; i++) {
                // right edge
                let cell = Cell.Builder.from(i, box.rightColumn).text("|").build();
                this.drawCell(cell);
            }

            // top right corner
            let cell = Cell.Builder.from(box.topRow, box.rightColumn).text(topRightCornerSymbol).build();
            this.drawCell(cell);
        }

        if (minRow != maxRow) {
            // bottom edge
            for (let i = minColumn + 1; i < maxColumn; i++) {
                let cell = Cell.Builder.from(box.bottomRow, i).text("-").build();
                this.drawCell(cell);
            }

            // bottom left corner
            let cell = Cell.Builder.from(box.bottomRow, box.leftColumn).text(bottomLeftCornerSymbol).build();
            this.drawCell(cell);
        }

        if (minRow != maxRow && minColumn != maxColumn) {
            // bottom right corner
            let cell = Cell.Builder.from(box.bottomRow, box.rightColumn).text(bottomRightCornerSymbol).build();
            this.drawCell(cell);
        }
    }

    private topLeftCornerSymbol(cornerStyle: BoxCornerStyle): string {
        switch (cornerStyle) {
            case BoxCornerStyle.Square:
                return '+';
            case BoxCornerStyle.Rounded:
                return '/';
        }
        return '+';
    }

    private topRightCornerSymbol(cornerStyle: BoxCornerStyle): string {
        switch (cornerStyle) {
            case BoxCornerStyle.Square:
                return '+';
            case BoxCornerStyle.Rounded:
                return '\\';
        }
        return '+';
    }

    private bottomLeftCornerSymbol(cornerStyle: BoxCornerStyle): string {
        switch (cornerStyle) {
            case BoxCornerStyle.Square:
                return '+';
            case BoxCornerStyle.Rounded:
                return '\\';
        }
        return '+';
    }

    private bottomRightCornerSymbol(cornerStyle: BoxCornerStyle): string {
        switch (cornerStyle) {
            case BoxCornerStyle.Square:
                return '+';
            case BoxCornerStyle.Rounded:
                return '/';
        }
        return '+';
    }
}

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

export class GridBoxDrawer extends AbstractBoxDrawer {
    private readonly grid: Grid;

    constructor(grid: Grid) {
        super();
        this.grid = grid;
    }

    drawCell(cell: Cell): void {
        this.grid.setTextForCell(cell.row, cell.column, cell.text);
    }
}
