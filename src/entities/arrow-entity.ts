import {Entity} from "./entity";
import {Domain} from "../drawer/cell";
import Cell = Domain.Cell;
import {Arrow, ArrowDirection} from "../drawer/arrow";
import {ArrayArrowDrawer} from "../drawer/arrow-drawer";
import {ArrowTipDirectionService} from "../arrow-tip-direction-service";

export class ArrowEntity extends Arrow implements Entity {

    private readonly _id: number;
    private readonly _cells: Array<Cell>;
    private _editing: boolean = false;

    constructor(id: number, startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ArrowDirection) {
        super(startRow, startColumn, endRow, endColumn, startDirection);
        this._id = id;
        const arrowDrawer = new ArrayArrowDrawer(new ArrowTipDirectionService()); // TODO refactor this
        arrowDrawer.draw(this);
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