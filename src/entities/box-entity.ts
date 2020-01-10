import {Domain} from "../drawers/cell";
import Cell = Domain.Cell;
import {Entity} from "./entity";
import {ArrayBoxDrawer} from "../drawers/box-drawer";
import {Box} from "../drawers/box";

export class BoxEntity implements Entity {
    private readonly _id: number;
    private readonly _topRow: number;
    private readonly _leftColumn: number;
    private readonly _bottomRow: number;
    private readonly _rightColumn: number;
    private readonly _cells: Array<Cell>;
    private _editing: boolean = false;

    constructor(id: number, topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        this._id = id;
        this._topRow = topRow;
        this._leftColumn = leftColumn;
        this._bottomRow = bottomRow;
        this._rightColumn = rightColumn;
        this._cells = [];

        const boxDrawer = new ArrayBoxDrawer();
        boxDrawer.draw(new Box(topRow, leftColumn, bottomRow, rightColumn));
        this._cells = boxDrawer.cells;
    }

    id(): number {
        return this._id;
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

    editing(): boolean {
        return this._editing;
    }

    endEditing(): void {
        this._editing = false;
    }

    startEditing(): void {
        this._editing = true;
    }
}
