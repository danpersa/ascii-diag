import Constants from "../constants";
import {Drawer} from "./drawer";
import {Cursor} from "./cursor";

export interface CursorDrawer extends Drawer<Cursor> {
}

export class CanvasCursorDrawer implements CursorDrawer {

    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    draw(cursor: Cursor): void {
        const cursorX = cursor.column * Constants.densityX;
        const cursorY = cursor.row * Constants.densityY;

        this.context.strokeStyle = Constants.accentColor;
        this.context.lineWidth = 2;
        this.context.beginPath();
        this.context.moveTo(cursorX, cursorY);
        this.context.lineTo(cursorX, cursorY + Constants.densityY);
        this.context.stroke();
    }
}
