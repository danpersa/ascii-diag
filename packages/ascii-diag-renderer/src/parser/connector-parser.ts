import {Grid} from "../entities/grid";
import {Shape} from "../shapes/shape";
import {ConnectorShape} from "../shapes/connector-shape";
import ShapeParser from "./parser";
import {ShapeIdService} from "../shapes/shape-id-service";


type ConnectorPoint = {
    row: number,
    column: number,
    hasConnection: boolean
}

type ConnectorEdge = {
    start: ConnectorPoint,
    end: ConnectorPoint
}

type PartialConnectorEdge = {
    start: ConnectorPoint | null,
    end: ConnectorPoint | null
}


export default class ConnectorParser implements ShapeParser {

    private readonly shapeIdService: ShapeIdService;

    constructor(shapeIdService: ShapeIdService) {
        this.shapeIdService = shapeIdService;
    }

    // takes a grid containing only connectors (no boxes or text) as a parameter
    // it parses the grid and
    // outputs an array of ConnectorShapes
    parse(grid: Grid): Array<Shape> {
        // identify horizontal edges
        let horizontalEdges = this.parseHorizontalEdges(grid);

        // identify vertical edges
        let verticalEdges = this.parseVerticalEdges(grid);

        // merge the ones having a common +
        let connectors = new Array<Shape>();
        horizontalEdges.forEach(horizontalEdge => {
            if (!this.hasConnection(horizontalEdge)) {
                this.addHorizontalConnectorEdge(horizontalEdge, connectors);
            } else {
                const intersectionPoint = this.connectionPoint(horizontalEdge);
                const horizontalEdgeStartPoint = this.noConnectionPoint(horizontalEdge);
                const verticalEdge = verticalEdges.find((verticalEdge: ConnectorEdge) => {
                    if (!this.hasConnection(verticalEdge)) {
                        return false;
                    }
                    const verticalEdgeIntersectionPoint = this.connectionPoint(verticalEdge);
                    return intersectionPoint.row == verticalEdgeIntersectionPoint.row &&
                        intersectionPoint.column == verticalEdgeIntersectionPoint.column;
                });

                if (verticalEdge) {
                    const verticalEdgeStartPoint = this.noConnectionPoint(verticalEdge);
                    const connectorType = {
                        horizontalEdge: {start: horizontalEdgeStartPoint, end: intersectionPoint},
                        intersectionPoint: intersectionPoint,
                        verticalEdge: {start: verticalEdgeStartPoint, end: intersectionPoint}
                    };

                    const shape = ConnectorShape.createShape(this.shapeIdService.nextId(),
                        connectorType);

                    connectors.push(shape);
                }
            }
        });

        // we add the vertical edges without connectors
        verticalEdges.forEach(verticalEdge => {
            if (!this.hasConnection(verticalEdge)) {
                this.addVerticalConnectorEdge(verticalEdge, connectors);
            }
        });

        return connectors;
    }

    private addHorizontalConnectorEdge(horizontalEdge: ConnectorEdge, connectors: Shape[]) {
        const connectorType = {
            horizontalEdge: {start: horizontalEdge.start, end: horizontalEdge.end},
            verticalEdge: null,
            intersectionPoint: null
        };
        const shape = ConnectorShape.createShape(this.shapeIdService.nextId(), connectorType);
        connectors.push(shape);
    }

    private addVerticalConnectorEdge(verticalEdge: ConnectorEdge, connectors: Shape[]) {
        const connectorType = {
            horizontalEdge: null,
            verticalEdge: {start: verticalEdge.start, end: verticalEdge.end},
            intersectionPoint: null
        };

        const shape = ConnectorShape.createShape(this.shapeIdService.nextId(), connectorType);
        connectors.push(shape);
    }

    private noConnectionPoint(edge: ConnectorEdge): ConnectorPoint {
        if (edge.start!.hasConnection) {
            return edge.end!;
        }
        return edge.start!;
    }

    private connectionPoint(edge: ConnectorEdge): ConnectorPoint {
        if (edge.start!.hasConnection) {
            return edge.start!;
        }
        return edge.end!;
    }

    private hasConnection(edge: ConnectorEdge) {
        return edge.start!.hasConnection || edge.end!.hasConnection;
    }

    private parseHorizontalEdges(grid: Grid) {
        let edges = new Array<ConnectorEdge>();
        let edge: PartialConnectorEdge = {start: null, end: null};
        for (let row = 0; row < grid.rows(); row++) {
            edge = this.pushEdge(edge, edges);
            for (let column = 0; column < grid.columns(); column++) {
                const cell = grid.cell(row, column);
                if (cell.text && cell.text == '-') {
                    this.initConnectorEdge(edge, row, column, false);
                } else if (cell.text && cell.text == '+') {
                    const shouldEnd = edge.start !== null;
                    this.initConnectorEdge(edge, row, column, true);
                    if (shouldEnd) {
                        edge = this.pushEdge(edge, edges);
                    }
                } else if (!cell.text) {
                    edge = this.pushEdge(edge, edges);
                }
            }
        }
        return edges;
    }

    private pushEdge(edge: PartialConnectorEdge, edges: ConnectorEdge[]) {
        if (edge.start !== null && edge.end !== null) {
            edges.push({start: edge.start, end: edge.end});
            return {start: null, end: null};
        }
        return edge;
    }

    private initConnectorEdge(edge: PartialConnectorEdge, row: number, column: number, hasConnection: boolean) {
        if (edge.start === null) {
            edge.start = {row: row, column: column, hasConnection: hasConnection};
            edge.end = {row: row, column: column, hasConnection: hasConnection};
        } else {
            edge.end = {row: row, column: column, hasConnection: hasConnection};
        }
    }

    private parseVerticalEdges(grid: Grid) {
        let edges = new Array<ConnectorEdge>();
        let edge: PartialConnectorEdge = {start: null, end: null};
        for (let column = 0; column < grid.columns(); column++) {
            edge = this.pushEdge(edge, edges);
            for (let row = 0; row < grid.rows(); row++) {
                const cell = grid.cell(row, column);
                if (cell.text && cell.text == '|') {
                    this.initConnectorEdge(edge, row, column, false);
                } else if (cell.text && cell.text == '+') {
                    const shouldEnd = edge.start !== null;
                    this.initConnectorEdge(edge, row, column, true);
                    if (shouldEnd) {
                        edge = this.pushEdge(edge, edges);
                    }
                } else if (!cell.text) {
                    edge = this.pushEdge(edge, edges);
                }
            }
        }
        return edges;
    }
}
