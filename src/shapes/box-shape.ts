import {Shape} from "./shape";
import {Box} from "../drawers/box";

export class BoxShape extends Box implements Shape {
    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        super(topRow, leftColumn, bottomRow, rightColumn);
        this._id = id;
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
