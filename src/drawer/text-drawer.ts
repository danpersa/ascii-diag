import {CellDrawer} from "./cell-drawer";
import {Domain} from "./cell";
import {Text} from "./text";
import Cell = Domain.Cell;

export interface TextDrawer {
    draw(text: Text): void;
}

export class CanvasTextDrawer implements TextDrawer {
    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        this.cellDrawer = cellDrawer;
    }

    draw(text: Text) {
        for (let i = 0; i < text.text.length; ++i) {
            let cell = Cell.Builder.from(text.row, text.column + i).text(text.text.charAt(i)).build();
            this.cellDrawer.draw(cell);
        }
    }
}
