import Grid from "./grid";
import Constants from "../constants";
import {Domain} from "./cell";
import Cell = Domain.Cell;

export interface CellDrawer {
    draw(cell: Cell): void;
}

export class CanvasCellDrawer implements CellDrawer {

    private readonly context: CanvasRenderingContext2D;
    private readonly grid: Grid;

    constructor(context: CanvasRenderingContext2D, grid: Grid) {
        this.context = context;
        this.grid = grid;
    }

    draw(cell: Cell) {
        this.drawSelected(cell);
        this.drawBorder(cell);
        this.drawText(cell);
    }

    private drawBorder(cell: Cell) {
        this.context.strokeStyle = `rgb(0, 0, 0, 0.3)`;
        this.context.lineWidth = 0.5;
        this.context.strokeRect(cell.canvasX, cell.canvasY, Constants.densityX, Constants.densityY);
    }

    private drawSelected(cell: Cell) {
        if (!cell.selected) {
            return;
        }
        this.context.fillStyle = `rgb(0, 0, 200, 0.3)`;
        this.context.fillRect(cell.canvasX, cell.canvasY, Constants.densityX, Constants.densityY);
    }

    private drawText(cell: Cell) {
        this.context.fillStyle = `rgb(0, 0, 0)`;
        this.context.font = Constants.font;
        this.context.fillText(cell.text, cell.canvasX + 2, cell.canvasY + 15);
    }
}
