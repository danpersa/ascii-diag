import {Drawer} from "./drawer";
import {Text} from "../entities/text";
import {Grid} from "../entities/grid";
import {Cell} from "../entities/cell";

export interface TextDrawer extends Drawer<Text> {
    draw(text: Text): void;
}

export abstract class AbstractTextDrawer implements Drawer<Text> {

    draw(text: Text): void {
        for (let i = 0; i < text.text.length; ++i) {
            let cell = Cell.Builder.from(text.row, text.column + i).text(text.text.charAt(i)).build();
            this.drawCell(cell);
        }
    }

    abstract drawCell(cell: Cell): void;
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

    drawCell(cell: Cell): void {
        this.grid.setTextForCell(cell.row, cell.column, cell.text);
    }
}
