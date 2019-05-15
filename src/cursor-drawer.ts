import Constants from "./constants";

export class CursorDrawer {

    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    draw(row: number, column: number): void {
        const cursorX = column * Constants.densityX;
        const cursorY = row * Constants.densityY;

        this.context.strokeStyle = Constants.accentColor;
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(cursorX, cursorY);
        this.context.lineTo(cursorX, cursorY + Constants.densityY);
        this.context.stroke();
    }
}
