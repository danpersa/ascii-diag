import {Domain} from "../cell";
import Cell = Domain.Cell;
import {Entity} from "./entity";

export class BoxEntity implements Entity {
    private readonly _topRow: number;
    private readonly _leftColumn: number;
    private readonly _bottomRow: number;
    private readonly _rightColumn: number;
    private readonly _cells: Array<Cell>;

    constructor(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        this._topRow = topRow;
        this._leftColumn = leftColumn;
        this._bottomRow = bottomRow;
        this._rightColumn = rightColumn;
        this._cells = [];
        this.addCorners();
        this.addTopAndBottomEdges();
        this.addLeftAndRightEdges();
    }

    private addCorners() {
        const topLeftCorner: Cell = Cell.Builder.from(this.topRow, this.leftColumn)
            .value("+")
            .build();
        const downRightCorner = Cell.Builder.from(this.bottomRow, this.rightColumn)
            .value("+")
            .build();
        const topRightCorner = Cell.Builder.from(this.topRow, this.rightColumn)
            .value("+")
            .build();
        const downLeftCorner = Cell.Builder.from(this.bottomRow, this.leftColumn)
            .value("+")
            .build();
        this._cells.push(topLeftCorner);
        this._cells.push(topRightCorner);
        this._cells.push(downLeftCorner);
        this._cells.push(downRightCorner);
    }

    private addLeftAndRightEdges() {
        for (let row = this.topRow + 1; row < this.bottomRow; ++row) {
            const leftEdgeCell = Cell.Builder.from(row, this.leftColumn)
                .value("|")
                .build();
            const rightEdgeCell = Cell.Builder.from(row, this.rightColumn)
                .value("|")
                .build();
            this._cells.push(leftEdgeCell);
            this._cells.push(rightEdgeCell);
        }
    }

    private addTopAndBottomEdges() {
        for (let column = this.leftColumn + 1; column < this.rightColumn; ++column) {
            const topEdgeCell = Cell.Builder.from(this.topRow, column)
                .value("-")
                .build();
            const downEdgeCell = Cell.Builder.from(this.bottomRow, column)
                .value("-")
                .build();
            this._cells.push(topEdgeCell);
            this._cells.push(downEdgeCell);
        }
    }

    get leftColumn(): number {
        return this._leftColumn;
    }

    get rightColumn(): number {
        return this._rightColumn;
    }

    get topRow(): number {
        return this._topRow;
    }

    get bottomRow(): number {
        return this._bottomRow;
    }

    cells(): Array<Domain.Cell> {
        return this._cells;
    }
}
