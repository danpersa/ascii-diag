import {Shape} from "./shape";
import {Text} from "../drawers/text";

export class TextShape extends Text implements Shape {
    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, row: number, column: number, text: string) {
        super(row, column, text);
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
