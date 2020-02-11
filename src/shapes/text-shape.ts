import {Shape} from "./shape";
import {Text} from "../drawers/text";

export class TextShape extends Text implements Shape {
    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, row: number, column: number, text: string, editing: boolean = false) {
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

export namespace TextShape {
    export class ShapeBuilder extends Text.Builder {
        protected _id: number;
        protected _editing: boolean = false;

        protected constructor(id: number, row: number, column: number, text: string, editing: boolean) {
            super(row, column, text);
            this._id = id;
            this._editing = editing;
        }

        static from(shape: TextShape): ShapeBuilder {
            return new ShapeBuilder(shape.id(), shape.row, shape.column, shape.text, shape.editing());
        }

        build(): TextShape {
            return new TextShape(this._id, this._row, this._column, this._text, this._editing);
        }

        id(value: number) {
            this._id = value;
            return this;
        }

        editing(value: boolean) {
            this._editing = value;
            return this;
        }
    }
}
