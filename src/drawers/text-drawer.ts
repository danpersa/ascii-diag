import {CellDrawer} from "./cell-drawer";
import {Domain} from "./cell";
import {Text} from "./text";
import {Drawer} from "./drawer";
import Grid from "./grid";
import Cell = Domain.Cell;

export interface TextDrawer extends Drawer<Text> {
    draw(text: Text): void;
}

abstract class AbstractTextDrawer implements Drawer<Text> {

    draw(text: Text): void {
        for (let i = 0; i < text.text.length; ++i) {
            let cell = Cell.Builder.from(text.row, text.column + i).text(text.text.charAt(i)).build();
            this.drawCell(cell);
        }
    }

    abstract drawCell(cell: Cell): void;
}

export class CanvasTextDrawer extends AbstractTextDrawer {
    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        super();
        this.cellDrawer = cellDrawer;
    }

    drawCell(cell: Domain.Cell): void {
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

export class GridTextDrawer extends AbstractTextDrawer implements Drawer<Text> {
    private readonly grid: Grid;

    static create(grid: Grid): Drawer<Text> {
        return new GridTextDrawer(grid);
    }

    constructor(grid: Grid) {
        super();
        this.grid = grid;
    }

    drawCell(cell: Domain.Cell): void {
        this.grid.setTextForCell(cell.row, cell.column, cell.text);
    }
}