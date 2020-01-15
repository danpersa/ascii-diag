import {Shape} from "./shape";
import {Arrow, ArrowDirection} from "../drawers/arrow";

export class ArrowShape extends Arrow implements Shape {

    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ArrowDirection) {
        super(startRow, startColumn, endRow, endColumn, startDirection);
        this._id = id;
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