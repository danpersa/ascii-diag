import {Constants, Drawer} from "ascii-diag-renderer";
import {Cursor} from "../entities/cursor";
import Has2DContext from "../has-2d-context";

export interface CursorDrawer extends Drawer<Cursor>, Has2DContext {
}

export class CanvasCursorDrawer implements CursorDrawer {

    readonly canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        this.canvasRef = canvasRef;
    }

    draw(cursor: Cursor): void {
        const cursorX = cursor.column * Constants.densityX;
        const cursorY = cursor.row * Constants.densityY;

        this.getContext().strokeStyle = Constants.accentColor;
        this.getContext().lineWidth = 2;
        this.getContext().beginPath();
        this.getContext().moveTo(cursorX, cursorY);
        this.getContext().lineTo(cursorX, cursorY + Constants.densityY);
        this.getContext().stroke();
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvasRef.current!.getContext("2d")!;
    }
}
