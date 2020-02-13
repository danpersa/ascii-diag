import {Box, BoxCornerStyle} from "./box";
import {Vertex} from "./vertex";
import Constants from "../constants";

export class SelectBox extends Box {
    private readonly _topLeftVertex: Vertex;
    private readonly _topRightVertex: Vertex;
    private readonly _bottomLeftVertex: Vertex;
    private readonly _bottomRightVertex: Vertex;
    private readonly _centerVertex: Vertex;

    static fromGrid(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        return new SelectBox(topRow, leftColumn, bottomRow, rightColumn);
    }

    private constructor(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        super(topRow, leftColumn, bottomRow, rightColumn, BoxCornerStyle.Square);
        this._topLeftVertex = Vertex.fromGrid(this.topRow, this.leftColumn);
        this._topRightVertex = Vertex.fromGrid(this.topRow, this.rightColumn + 1);
        this._bottomLeftVertex = Vertex.fromGrid(this.bottomRow + 1, this.leftColumn);
        this._bottomRightVertex = Vertex.fromGrid(this.bottomRow + 1, this.rightColumn + 1);
        this._centerVertex = Vertex.fromCanvas(
            leftColumn * Constants.densityX + (rightColumn + 1 - leftColumn) * Constants.densityX / 2,
            topRow * Constants.densityY + (bottomRow + 1 - topRow) * Constants.densityY / 2
        );
    }

    get bottomRightVertex(): Vertex {
        return this._bottomRightVertex;
    }

    get bottomLeftVertex(): Vertex {
        return this._bottomLeftVertex;
    }

    get topRightVertex(): Vertex {
        return this._topRightVertex;
    }

    get topLeftVertex(): Vertex {
        return this._topLeftVertex;
    }

    get centerVertex(): Vertex {
        return this._centerVertex;
    }
}
