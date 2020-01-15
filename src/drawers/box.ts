import Constants from "../constants";

export class Box {
    private readonly _canvasX: number;
    private readonly _canvasY: number;
    private readonly _canvasWidth: number;
    private readonly _canvasHeight: number;

    private readonly _topRow: number;
    private readonly _leftColumn: number;
    private readonly _bottomRow: number;
    private readonly _rightColumn: number;

    constructor(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        this._topRow = topRow;
        this._leftColumn = leftColumn;
        this._bottomRow = bottomRow;
        this._rightColumn = rightColumn;

        this._canvasX = leftColumn * Constants.densityX;
        this._canvasY = topRow * Constants.densityY;
        this._canvasWidth = (rightColumn - leftColumn + 1) * Constants.densityX;
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
