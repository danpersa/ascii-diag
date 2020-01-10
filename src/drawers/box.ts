import Constants from "../constants";

export class Box {
    private _canvasX: number;
    private _canvasY: number;
    private _canvasWidth: number;
    private _canvasHeight: number;

    private _topRow: number;
    private _leftColumn: number;
    private _bottomRow: number;
    private _rightColumn: number;

    constructor(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        this._topRow = topRow;
        this._leftColumn = leftColumn;
        this._bottomRow = bottomRow;
        this._rightColumn = rightColumn;

        this._canvasX = leftColumn * Constants.densityX;
        this._canvasY = topRow * Constants.densityY;
        this._canvasWidth = (rightColumn - leftColumn +1) * Constants.densityX;
        this._canvasHeight = (bottomRow - topRow + 1) * Constants.densityY;
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
}
