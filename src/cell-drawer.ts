import Grid from "./grid";
import Constants from "./constants";
import {Domain} from "./cell";
import Cell = Domain.Cell;

export class CellDrawer {

    private readonly context: CanvasRenderingContext2D;
    private readonly grid: Grid;

    constructor(context: CanvasRenderingContext2D, grid: Grid) {
        this.context = context;
        this.grid = grid;
        context.font = Constants.font;
    }

    drawCell(row: number, column: number) {
        const cell = this.grid.cell(row, column);

        this.drawSelected(cell);
        this.drawBorder(cell);
        this.drawValue(cell);
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

    private drawValue(cell: Cell) {
        this.context.fillStyle = `rgb(0, 0, 0)`;
        this.context.font = Constants.font;
        this.context.fillText(cell.value, cell.canvasX + 2, cell.canvasY + 15);
    }
}
