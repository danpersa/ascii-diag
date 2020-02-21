import {Shape} from "./shape";
import {Box, BoxCornerStyle} from "../drawers/box";
import {LineStyle} from "../drawers/connector";

export class BoxShape extends Box implements Shape {
    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, topRow: number, leftColumn: number, bottomRow: number, rightColumn: number,
                cornerStyle: BoxCornerStyle, lineStyle: LineStyle,
                editing: boolean = false) {
        super(topRow, leftColumn, bottomRow, rightColumn, cornerStyle, lineStyle);
        this._id = id;
        this._editing = editing;
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

export namespace BoxShape {
    export class ShapeBuilder extends Box.Builder {
        protected _id: number;
        protected _editing: boolean = false;

        protected constructor(id: number, topRow: number, leftColumn: number, bottomRow: number, rightColumn: number,
                              cornerStyle: BoxCornerStyle, lineStyle: LineStyle,
                              editing: boolean = false) {
            super(topRow, leftColumn, bottomRow, rightColumn, cornerStyle, lineStyle);
            this._id = id;
            this._editing = editing;
        }

        static from(box: BoxShape): ShapeBuilder {
            return new ShapeBuilder(box.id(), box.topRow, box.leftColumn, box.bottomRow,
                box.rightColumn, box.cornerStyle, box.lineStyle, box.editing());
        }

        build(): BoxShape {
            return new BoxShape(this._id, this._topRow, this._leftColumn, this._bottomRow, this._rightColumn,
                this._cornerStyle, this._lineStyle, this._editing);
        }

        id(value: number) {
            this._id = value;
            return this;
        }
    }
}
