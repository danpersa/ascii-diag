import {CellDrawer} from "./cell-drawer";
import {Domain} from "./cell";
import {Text} from "./text";
import Cell = Domain.Cell;

export class TextDrawer {
    private cellDrawer: CellDrawer;
    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, cellDrawer: CellDrawer) {
        this.context = context;
        this.cellDrawer = cellDrawer;
    }

    draw(text: Text) {
        for (let i = 0; i < text.text.length; ++i) {
            let cell = Cell.Builder.from(text.row, text.column + i).value(text.text.charAt(i)).build();
            this.cellDrawer.draw(cell);
        }
    }
}
