import {Box} from "./box";
import {Vertex} from "./vertex";

export class SelectBox extends Box {
    private _topLeftVertex: Vertex;
    private _topRightVertex: Vertex;
    private _bottomLeftVertex: Vertex;
    private _bottomRightVertex: Vertex;

    constructor(topRow: number, leftColumn: number, bottomRow: number, rightColumn: number) {
        super(topRow, leftColumn, bottomRow, rightColumn);
        this._topLeftVertex = new Vertex(this.topRow, this.leftColumn);
        this._topRightVertex = new Vertex(this.topRow, this.rightColumn + 1);
        this._bottomLeftVertex = new Vertex(this.bottomRow + 1, this.leftColumn);
        this._bottomRightVertex = new Vertex(this.bottomRow + 1, this.rightColumn + 1);
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
}
