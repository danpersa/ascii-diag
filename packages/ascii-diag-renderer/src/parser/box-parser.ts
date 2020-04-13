import ShapeParser from "./parser";
import {Shape} from "../shapes/shape";
import {Grid} from "../entities/grid";
import {BoxShape} from "../shapes/box-shape";
import {BoxCornerStyle} from "../entities/box";
import {LineStyle} from "../entities/connector";
import {Cell} from "../entities/cell";
import {ShapeIdService} from "../shapes/shape-id-service";

export default class BoxParser implements ShapeParser {
    private readonly shapeIdService: ShapeIdService;

    constructor(shapeIdService: ShapeIdService) {
        this.shapeIdService = shapeIdService;
    }

    // takes a grid containing boxes and connectors (no text) as a parameter
    // it parses the grid and
    // outputs an array of BoxShapes
    parse(grid: Grid): Array<Shape> {
        // we identify all pluses
        const pluses = Array<Cell>();
        for (let row = 0; row < grid.rows(); ++row) {
            for (let column = 0; column < grid.columns(); ++column) {
                const cell = grid.cell(row, column);
                if (cell.text == '+') {
                    pluses.push(grid.cell(row, column));
                }
            }
        }
        // from each plus we identify edges
        let edges = Array<Edge>();
        for (let plusCell of pluses) {
            let plusCellRow = plusCell.row;
            let plusCellColumn = plusCell.column;
            // edges to right
            for (let column = plusCell.column + 1; column < grid.columns(); ++column) {
                let cell = grid.cell(plusCellRow, column);
                if (cell.text == '+') {
                    edges.push(Edge.create(plusCell, cell, EdgeType.Horizontal));
                } else if (cell.text != '-') {
                    break;
                }
            }
            // edges to left
            for (let column = plusCell.column - 1; column >= 0; --column) {
                let cell = grid.cell(plusCellRow, column);
                if (cell.text == '+') {
                    edges.push(Edge.create(plusCell, cell, EdgeType.Horizontal));
                } else if (cell.text != '-') {
                    break;
                }
            }
            // edges to top
            for (let row = plusCell.row - 1; row >= 0; --row) {
                let cell = grid.cell(row, plusCellColumn);
                if (cell.text == '+') {
                    edges.push(Edge.create(plusCell, cell, EdgeType.Vertical));
                } else if (cell.text != '|') {
                    break;
                }
            }

            // edges to bottom
            for (let row = plusCell.row + 1; row < grid.rows(); ++row) {
                let cell = grid.cell(row, plusCellColumn);
                if (cell.text == '+') {
                    edges.push(Edge.create(plusCell, cell, EdgeType.Vertical));
                } else if (cell.text != '|') {
                    break;
                }
            }
        }

        // we eliminate duplicate edges
        const uniqueEdges = Array<Edge>();
        for (let edge of edges) {
            if (!this.containsEdge(uniqueEdges, edge)) {
                uniqueEdges.push(edge);
            }
        }

        // get the horizontal edges
        const horizontalEdges = uniqueEdges.filter(value => value.type === EdgeType.Horizontal);

        // for each horizontal edge
        const horizontalParallelEdgePairs = horizontalEdges.flatMap((edge, index) => {
                // we look for all edges parallel with it which can create a box
                const parallelEdges = horizontalEdges.filter(candidate => {
                    return candidate.start.row !== edge.start.row &&
                        ((candidate.start.column === edge.start.column && candidate.end.column === edge.end.column) ||
                            (candidate.start.column === edge.end.column && candidate.end.column == edge.start.column));

                }).map(parallelEdge => {
                    return ParallelEdgePair.create(edge, parallelEdge, EdgeType.Horizontal);
                });
                return parallelEdges;
            }
        );

        // we eliminate duplicate edge pairs
        const uniqueHorizontalEdgePairs = new Array<ParallelEdgePair>();
        horizontalParallelEdgePairs.forEach(edgePair => {
            if (!this.containsEdgePair(uniqueHorizontalEdgePairs, edgePair)) {
                uniqueHorizontalEdgePairs.push(edgePair);
            }
        });

        // we get the vertical edges
        const verticalEdges = uniqueEdges.filter(value => value.type === EdgeType.Vertical);

        // for each horizontalParallelEdgePair we look for the bot the left and the right edges within the vertical edges
        const boxes: Array<FourEdges> = uniqueHorizontalEdgePairs.flatMap(edgePair => {
            // search for the left edge
            const leftEdge = verticalEdges.find(verticalEdge => {
                return verticalEdge.equals(Edge.create(edgePair.edge1.start, edgePair.edge2.start, EdgeType.Vertical));
            });
            // search for the right edge
            const rightEdge = verticalEdges.find(verticalEdge => {
                return verticalEdge.equals(Edge.create(edgePair.edge1.end, edgePair.edge2.end, EdgeType.Vertical));
            });
            if (leftEdge && rightEdge) {
                return [{
                    topEdge: edgePair.edge1,
                    bottomEdge: edgePair.edge2,
                    leftEdge: leftEdge,
                    rightEdge: rightEdge
                }];
            } else {
                return new Array<FourEdges>();
            }
        });

        // transform the boxes to shapes
        const shapes: Array<Shape> = boxes.map(box => new BoxShape(this.shapeIdService.nextId(), box.topEdge.start.row,
            box.topEdge.start.column, box.bottomEdge.start.row, box.bottomEdge.end.column,
            BoxCornerStyle.Square, LineStyle.Continuous));


        return shapes;
    }

    private containsEdge(uniqueEdges: Array<Edge>, edge: Edge):
        boolean {
        return uniqueEdges.filter(currentEdge => {
            return currentEdge.equals(edge);
        }).length != 0;
    }

    private containsEdgePair(uniqueEdges: Array<ParallelEdgePair>, edgePair: ParallelEdgePair):
        boolean {
        return uniqueEdges.filter(currentEdge => {
            return currentEdge.equals(edgePair);
        }).length != 0;
    }

}


enum EdgeType {
    Horizontal, Vertical
}

type Point = {
    row: number,
    column: number
}

type FourEdges = {
    topEdge: Edge,
    bottomEdge: Edge,
    leftEdge: Edge,
    rightEdge: Edge,
}

// a group of two points
// when the edge is horizontal, the start point if on the left of the end point
// when the edge is vertical, the start point in on top of the end point
class Edge {
    private readonly _start: Point;
    private readonly _end: Point;
    private readonly _type: EdgeType;

    static create(start: Point, end: Point, type: EdgeType) {
        switch (type) {
            case EdgeType.Horizontal:
                if (start.column < end.column) {
                    return new Edge(start, end, type);
                } else {
                    return new Edge(end, start, type);
                }
            case EdgeType.Vertical:
                if (start.row < end.row) {
                    return new Edge(start, end, type);
                } else {
                    return new Edge(end, start, type);
                }
        }
    }

    private constructor(start: Point, end: Point, type: EdgeType) {
        this._start = {row: start.row, column: start.column};
        this._end = {row: end.row, column: end.column};
        this._type = type;
    }

    equals(edge: Edge) {
        return this._start.row == edge._start.row && this._start.column == edge._start.column &&
            this._end.row == edge._end.row && this._end.column == edge._end.column;
    }

    get start(): Point {
        return this._start;
    }

    get end(): Point {
        return this._end;
    }

    get type(): EdgeType {
        return this._type;
    }
}

// a group of two parallel edges
// when the edges are horizontal, the first edge is on top of the second edge
// when the edges are vertical, the first edge is on the left side of the second edge
class ParallelEdgePair {
    private readonly _edge1: Edge;
    private readonly _edge2: Edge;
    private readonly _type: EdgeType;

    static create(first: Edge, second: Edge, type: EdgeType): ParallelEdgePair {
        switch (type) {
            case EdgeType.Horizontal:
                if (first.start.row < second.start.row) {
                    return new ParallelEdgePair(first, second, type);
                } else {
                    return new ParallelEdgePair(second, first, type);
                }
            case EdgeType.Vertical:
                if (first.start.column < second.start.column) {
                    return new ParallelEdgePair(first, second, type);
                } else {
                    return new ParallelEdgePair(second, first, type);
                }
        }
    }

    private constructor(first: Edge, second: Edge, type: EdgeType) {
        this._type = type;
        this._edge1 = first;
        this._edge2 = second;
    }

    get edge1(): Edge {
        return this._edge1;
    }

    get edge2(): Edge {
        return this._edge2;
    }

    get type(): EdgeType {
        return this._type;
    }

    equals(edgePair: ParallelEdgePair) {
        return this._type === edgePair._type && this._edge1.equals(edgePair._edge1) && this._edge2.equals(edgePair._edge2);
    }
}
