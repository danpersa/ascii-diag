import {CellDrawer} from "./cell-drawer";
import {Arrow, ArrowDirection} from "./arrow";
import {Domain} from "./cell";
import Cell = Domain.Cell;

export abstract class AbstractArrowDrawer {

    abstract addCell(cell: Cell): void;

    draw(arrow: Arrow): void {
        let cell = Cell.Builder.from(arrow.startRow, arrow.startColumn).value("+").build();
        this.addCell(cell);

        const minColumn = Math.min(arrow.startColumn, arrow.endColumn);
        const maxColumn = Math.max(arrow.startColumn, arrow.endColumn);
        const minRow = Math.min(arrow.startRow, arrow.endRow);
        const maxRow = Math.max(arrow.startRow, arrow.endRow);
        const arrowSymbol = this.arrowDirection(arrow.startRow, arrow.startColumn, arrow.endRow, arrow.endColumn, arrow.startDirection);

        if (arrow.startDirection === ArrowDirection.Horizontal) {
            for (let column = minColumn + 1; column < maxColumn; ++column) {
                const cell = Cell.Builder.from(arrow.startRow, column).value("-").build();
                this.addCell(cell);
            }
            if (arrow.startRow == arrow.endRow) {
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.startRow, arrow.endColumn).value(arrowSymbol).build();
                    this.addCell(cell);
                }
            } else {
                const cell = Cell.Builder.from(arrow.startRow, arrow.endColumn).value("+").build();
                this.addCell(cell);
                for (let row = minRow + 1; row < maxRow; ++row) {
                    const cell = Cell.Builder.from(row, arrow.endColumn).value("|").build();
                    this.addCell(cell);
                }
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.endRow, arrow.endColumn).value(arrowSymbol).build();
                    this.addCell(cell);
                }
            }
        } else if (arrow.startDirection === ArrowDirection.Vertical) {
            for (let row = minRow + 1; row < maxRow; ++row) {
                const cell = Cell.Builder.from(row, arrow.startColumn).value("|").build();
                this.addCell(cell);
            }
            if (arrow.startColumn == arrow.endColumn) {
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.endRow, arrow.endColumn).value(arrowSymbol).build();
                    this.addCell(cell);
                }
            } else {
                const cell = Cell.Builder.from(arrow.endRow, arrow.startColumn).value("+").build();
                this.addCell(cell);
                for (let column = minColumn + 1; column < maxColumn; ++column) {
                    const cell = Cell.Builder.from(arrow.endRow, column).value("-").build();
                    this.addCell(cell);
                }
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.endRow, arrow.endColumn).value(arrowSymbol).build();
                    this.addCell(cell);
                }
            }
        }
    }

    private arrowDirection(startRow: number, startColumn: number, row: number, column: number, startDirection: ArrowDirection): string | null {
        // horizontal
        if (startRow == row) {
            if (startColumn > column) {
                return "<";
            } else if (startColumn < column) {
                return ">";
            } else {
                return null;
            }
            // vertical
        } else if (startColumn == column) {
            if (startRow > row) {
                return "^"; // ∧
            } else if (startRow < row) {
                return "v"; // ∨
            } else {
                return null;
            }
        } else {
            if (startDirection === ArrowDirection.Horizontal) {
                if (startRow > row) {
                    return "^"; // ∧
                } else {
                    return "v"; // ∨
                }
            } else if (startDirection === ArrowDirection.Vertical) {
                if (startColumn > column) {
                    return "<";
                } else {
                    return ">";
                }
            } else {
                return null
            }
        }
    }
}

export class ArrowDrawer extends AbstractArrowDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer) {
        super();
        this.cellDrawer = cellDrawer;
    }

    addCell(cell: Cell) {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayArrowDrawer extends AbstractArrowDrawer {
    private readonly _cells: Array<Cell> = [];

    addCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}