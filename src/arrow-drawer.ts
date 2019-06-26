import {CellDrawer} from "./cell-drawer";
import {Arrow, ArrowDirection, ArrowTipDirection} from "./arrow";
import {Domain} from "./cell";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import Cell = Domain.Cell;

export abstract class AbstractArrowDrawer {

    private readonly arrowTipDirectionService: ArrowTipDirectionService;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
    }

    abstract addCell(cell: Cell): void;

    draw(arrow: Arrow): void {
        let cell = Cell.Builder.from(arrow.startRow, arrow.startColumn).value("+").build();
        this.addCell(cell);

        const minColumn = Math.min(arrow.startColumn, arrow.endColumn);
        const maxColumn = Math.max(arrow.startColumn, arrow.endColumn);
        const minRow = Math.min(arrow.startRow, arrow.endRow);
        const maxRow = Math.max(arrow.startRow, arrow.endRow);
        const arrowSymbol = this.endArrowDirection(arrow);

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

export class ArrowDrawer extends AbstractArrowDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer, arrowTipDirectionService: ArrowTipDirectionService) {
        super(arrowTipDirectionService);
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