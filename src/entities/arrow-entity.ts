import {Entity} from "./entity";
import {Domain} from "../cell";
import Cell = Domain.Cell;
import {Arrow, ArrowDirection} from "../arrow";
import {ArrayArrowDrawer} from "../arrow-drawer";

export class ArrowEntity implements Entity {

    private readonly _id: number;
    private readonly _startRow: number;
    private readonly _startColumn: number;
    private readonly _endRow: number;
    private readonly _endColumn: number;
    private readonly _startDirection: ArrowDirection;
    private readonly _cells: Array<Cell>;
    private _editing: boolean = false;

    constructor(id: number, startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ArrowDirection) {
        this._id = id;
        this._startRow = startRow;
        this._startColumn = startColumn;
        this._endRow = endRow;
        this._endColumn = endColumn;
        this._startDirection = startDirection;
        const arrowDrawer = new ArrayArrowDrawer();
        arrowDrawer.draw(new Arrow(startRow, startColumn, endRow, endColumn, startDirection));
        this._cells = arrowDrawer.cells;
    }

    get startRow(): number {
        return this._startRow;
    }

    get startColumn(): number {
        return this._startColumn;
    }

    get endRow(): number {
        return this._endRow;
    }

    get endColumn(): number {
        return this._endColumn;
    }

    get startDirection(): ArrowDirection {
        return this._startDirection;
    }

    id(): number {
        return this._id;
    }

    cells(): Array<Cell> {
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