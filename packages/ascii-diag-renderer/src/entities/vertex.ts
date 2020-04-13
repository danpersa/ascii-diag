import {Constants} from "../constants";

export class Vertex {
    private readonly _canvasX: number;
    private readonly _canvasY: number;

    static fromGrid(row: number, column: number) {
        return new Vertex(column * Constants.densityX, row * Constants.densityY);
    }

    static fromCanvas(canvasX: number, canvasY: number) {
        return new Vertex(canvasX, canvasY);
    }

    private constructor(canvasX: number, canvasY: number) {
        this._canvasX = canvasX;
        this._canvasY = canvasY;
    }

    get canvasY(): number {
        return this._canvasY;
    }

    get canvasX(): number {
        return this._canvasX;
    }

    containsPoint(x: number, y: number): boolean {
        if (x > this._canvasX - Constants.halfVertexRadius && y > this._canvasY - Constants.halfVertexRadius && x < this.canvasX + Constants.halfVertexRadius && y < this.canvasY + Constants.halfVertexRadius) {
            return true;
        }
        return false;
    }
}
