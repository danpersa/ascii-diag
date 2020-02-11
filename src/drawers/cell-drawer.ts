import Constants from "../constants";
import {Domain} from "./cell";
import Cell = Domain.Cell;
import Has2DContext from "../has-2d-context";

export interface CellDrawer {
    draw(cell: Cell): void;
}

export class CanvasCellDrawer implements CellDrawer, Has2DContext {

    readonly canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        this.canvasRef = canvasRef;
    }

    draw(cell: Cell) {
        this.drawSelected(cell);
        this.drawBorder(cell);
        this.drawText(cell);
    }

    private drawBorder(cell: Cell) {
        this.getContext().strokeStyle = `rgb(0, 0, 0, 0.3)`;
        this.getContext().lineWidth = 0.5;
        this.getContext().strokeRect(cell.canvasX, cell.canvasY, Constants.densityX, Constants.densityY);
    }

    private drawSelected(cell: Cell) {
        if (!cell.selected) {
            return;
        }
        this.getContext().fillStyle = `rgb(0, 0, 200, 0.3)`;
        this.getContext().fillRect(cell.canvasX, cell.canvasY, Constants.densityX, Constants.densityY);
    }

    private drawText(cell: Cell) {
        this.getContext().fillStyle = `rgb(0, 0, 0)`;
        this.getContext().font = Constants.font;
        this.getContext().fillText(cell.text, cell.canvasX + 2, cell.canvasY + 15);
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvasRef.current!.getContext("2d")!;
    }
}
