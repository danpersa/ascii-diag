import {CellDrawer} from "./cell-drawer";
import {Arrow, ArrowDirection, ArrowTipDirection} from "./arrow";
import {Domain} from "./cell";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import {Drawer} from "./drawer";
import Cell = Domain.Cell;

export interface ArrowDrawer extends Drawer<Arrow> {
}

export abstract class AbstractArrowDrawer implements ArrowDrawer {

    private readonly arrowTipDirectionService: ArrowTipDirectionService;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
    }

    abstract drawCell(cell: Cell): void;

    draw(arrow: Arrow): void {
        let cell = Cell.Builder.from(arrow.startRow, arrow.startColumn).value("+").build();
        this.drawCell(cell);

        const minColumn = Math.min(arrow.startColumn, arrow.endColumn);
        const maxColumn = Math.max(arrow.startColumn, arrow.endColumn);
        const minRow = Math.min(arrow.startRow, arrow.endRow);
        const maxRow = Math.max(arrow.startRow, arrow.endRow);
        const arrowSymbol = this.endArrowDirection(arrow);

        if (arrow.startDirection === ArrowDirection.Horizontal) {
            for (let column = minColumn + 1; column < maxColumn; ++column) {
                const cell = Cell.Builder.from(arrow.startRow, column).value("-").build();
                this.drawCell(cell);
            }
            if (arrow.startRow == arrow.endRow) {
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.startRow, arrow.endColumn).value(arrowSymbol).build();
                    this.drawCell(cell);
                }
            } else {
                const cell = Cell.Builder.from(arrow.startRow, arrow.endColumn).value("+").build();
                this.drawCell(cell);
                for (let row = minRow + 1; row < maxRow; ++row) {
                    const cell = Cell.Builder.from(row, arrow.endColumn).value("|").build();
                    this.drawCell(cell);
                }
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.endRow, arrow.endColumn).value(arrowSymbol).build();
                    this.drawCell(cell);
                }
            }
        } else if (arrow.startDirection === ArrowDirection.Vertical) {
            for (let row = minRow + 1; row < maxRow; ++row) {
                const cell = Cell.Builder.from(row, arrow.startColumn).value("|").build();
                this.drawCell(cell);
            }
            if (arrow.startColumn == arrow.endColumn) {
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.endRow, arrow.endColumn).value(arrowSymbol).build();
                    this.drawCell(cell);
                }
            } else {
                const cell = Cell.Builder.from(arrow.endRow, arrow.startColumn).value("+").build();
                this.drawCell(cell);
                for (let column = minColumn + 1; column < maxColumn; ++column) {
                    const cell = Cell.Builder.from(arrow.endRow, column).value("-").build();
                    this.drawCell(cell);
                }
                if (arrowSymbol) {
                    const cell = Cell.Builder.from(arrow.endRow, arrow.endColumn).value(arrowSymbol).build();
                    this.drawCell(cell);
                }
            }
        }
    }

    private endArrowDirection(arrow: Arrow): string | null {
        const tipDirection = this.arrowTipDirectionService.endTipDirection(arrow);
        switch (tipDirection) {
            case ArrowTipDirection.North:
                return "^";
            case ArrowTipDirection.South:
                return "v";
            case ArrowTipDirection.East:
                return ">";
            case ArrowTipDirection.West:
                return "<";
        }
        return null;
    }
}

export class CanvasArrowDrawer extends AbstractArrowDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer, arrowTipDirectionService: ArrowTipDirectionService) {
        super(arrowTipDirectionService);
        this.cellDrawer = cellDrawer;
    }

    drawCell(cell: Cell) {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayArrowDrawer extends AbstractArrowDrawer {
    private readonly _cells: Array<Cell> = [];

    drawCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}
