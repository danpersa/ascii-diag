import Constants from "./constants";

export class Vertex {
    private _canvasX: number;
    private _canvasY: number;
    private _row: number;
    private _column: number;

    constructor(row: number, column: number) {
        this._row = row;
        this._column = column;
        this._canvasX = this._column * Constants.densityX;
        this._canvasY = this._row * Constants.densityY;
    }

    get column(): number {
        return this._column;
    }

    get row(): number {
        return this._row;
    }

    get canvasY(): number {
        return this._canvasY;
    }

    get canvasX(): number {
        return this._canvasX;
    }

    containsPoint(x: number, y: number): boolean {
        if (x > this._canvasX && y > this._canvasY && x < this.canvasX + 6 && y < this.canvasY + 6) {
            return true;
        }
        return false;
    }
}
