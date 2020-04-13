import {Constants} from "../constants";
import {LineStyle} from "./connector";

export enum BoxCornerStyle {
    Square,
    Rounded
}

export class Box {
    private readonly _canvasX: number;
    private readonly _canvasY: number;
    private readonly _canvasWidth: number;
    private readonly _canvasHeight: number;

    private readonly _topRow: number;
    private readonly _leftColumn: number;
    private readonly _bottomRow: number;
    private readonly _rightColumn: number;

    private readonly _cornerStyle: BoxCornerStyle;
    private readonly _lineStyle: LineStyle;


    constructor(topRow: number, leftColumn: number, bottomRow: number,
                rightColumn: number, cornerStyle: BoxCornerStyle, lineStyle: LineStyle) {
        this._topRow = topRow;
        this._leftColumn = leftColumn;
        this._bottomRow = bottomRow;
        this._rightColumn = rightColumn;

        this._canvasX = leftColumn * Constants.densityX;
        this._canvasY = topRow * Constants.densityY;
        this._canvasWidth = (rightColumn - leftColumn + 1) * Constants.densityX;
        this._canvasHeight = (bottomRow - topRow + 1) * Constants.densityY;

        this._cornerStyle = cornerStyle;
        this._lineStyle = lineStyle;
    }

    get rightColumn(): number {
        return this._rightColumn;
    }

    get bottomRow(): number {
        return this._bottomRow;
    }

    get leftColumn(): number {
        return this._leftColumn;
    }

    get topRow(): number {
        return this._topRow;
    }

    get canvasHeight(): number {
        return this._canvasHeight;
    }

    get canvasWidth(): number {
        return this._canvasWidth;
    }

    get canvasY(): number {
        return this._canvasY;
    }

    get canvasX(): number {
        return this._canvasX;
    }

    get cornerStyle(): BoxCornerStyle {
        return this._cornerStyle;
    }

    get lineStyle(): LineStyle {
        return this._lineStyle;
    }
}

export namespace Box {
    export class Builder {
        protected _topRow: number;
        protected _leftColumn: number;
        protected _bottomRow: number;
        protected _rightColumn: number;
        protected _cornerStyle: BoxCornerStyle;
        protected _lineStyle: LineStyle;


        protected constructor(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number,
                              cornerStyle: BoxCornerStyle, lineStyle: LineStyle) {
            this._topRow = topRow;
            this._leftColumn = leftColumn;
            this._bottomRow = bottomRow;
            this._rightColumn = rightColumn;
            this._cornerStyle = cornerStyle;
            this._lineStyle = lineStyle
        }

        static from(box: Box): Builder {
            return new Builder(box.topRow, box.leftColumn, box.bottomRow, box.rightColumn, box.cornerStyle, box.lineStyle);
        }

        build(): Box {
            return new Box(this._topRow, this._leftColumn, this._bottomRow,
                this._rightColumn, this._cornerStyle, this._lineStyle);
        }

        topRow(value: number) {
            this._topRow = value;
            return this;
        }

        leftColumn(value: number) {
            this._leftColumn = value;
            return this;
        }

        bottomRow(value: number) {
            this._bottomRow = value;
            return this;
        }

        rightColumn(value: number) {
            this._rightColumn = value;
            return this;
        }

        cornerStyle(value: BoxCornerStyle) {
            this._cornerStyle = value;
            return this;
        }

        lineStyle(value: LineStyle) {
            this._lineStyle = value;
            return this;
        }
    }
}
