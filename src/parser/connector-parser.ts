import Grid from "../drawers/grid";
import {Shape} from "../shapes/shape";
import {ConnectorShape} from "../shapes/connector-shape";
import {ConnectorDirection} from "../drawers/connector";
import {ShapeIdService} from "../shapes/shape-id-service";
import ShapeParser from "./parser";


type ConnectorPoint = {
    row: number,
    column: number,
    hasConnection: boolean
}

type ConnectorEdge = {
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
                this.addConnectorEdge(horizontalEdge, connectors);
            } else {
                const horizontalEdgeConnectionPoint = this.connectionPoint(horizontalEdge);
                const horizontalEdgeNoConnectionPoint = this.noConnectionPoint(horizontalEdge);
                const verticalEdge = verticalEdges.find((verticalEdge: ConnectorEdge) => {
                    if (!this.hasConnection(verticalEdge)) {
                        return false;
                    }
                    const verticalEdgeConnectionPoint = this.connectionPoint(verticalEdge);
                    return horizontalEdgeConnectionPoint.row == verticalEdgeConnectionPoint.row &&
                        horizontalEdgeConnectionPoint.column == verticalEdgeConnectionPoint.column;
                });

                if (verticalEdge) {
                    const verticalEdgeNoConnectionPoint = this.noConnectionPoint(verticalEdge);

                    let direction = this.getConnectorDirection(horizontalEdgeNoConnectionPoint, verticalEdgeNoConnectionPoint);

                    const connector = new ConnectorShape(this.shapeIdService.nextId(),
                        horizontalEdgeNoConnectionPoint.row, horizontalEdgeNoConnectionPoint.column,
                        verticalEdgeNoConnectionPoint.row, verticalEdgeNoConnectionPoint.column,
                        direction);
                    connectors.push(connector)
                }
            }
        });

        // we add the vertical edges without connectors
        verticalEdges.forEach(verticalEdge => {
            if (!this.hasConnection(verticalEdge)) {
                this.addConnectorEdge(verticalEdge, connectors);
            }
        });

        return connectors;
    }

    private getConnectorDirection(horizontalEdgeNoConnectionPoint: ConnectorPoint, verticalEdgeNoConnectionPoint: ConnectorPoint) {
        if (horizontalEdgeNoConnectionPoint.column <= verticalEdgeNoConnectionPoint.column) {
            return ConnectorDirection.Horizontal;
        }
        return ConnectorDirection.Vertical;
    }

    private addConnectorEdge(verticalEdge: ConnectorEdge, connectors: Shape[]) {
        const connector = new ConnectorShape(this.shapeIdService.nextId(),
            verticalEdge.start!.row, verticalEdge.start!.column,
            verticalEdge.end!.row, verticalEdge.end!.column,
            ConnectorDirection.Horizontal);
        connectors.push(connector);
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
        let edge: ConnectorEdge = {start: null, end: null};
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

    private pushEdge(edge: ConnectorEdge, edges: ConnectorEdge[]) {
        if (edge.start !== null) {
            edges.push(edge);
            edge = {start: null, end: null};
        }
        return edge;
    }

    private initConnectorEdge(edge: ConnectorEdge, row: number, column: number, hasConnection: boolean) {
        if (edge.start === null) {
            edge.start = {row: row, column: column, hasConnection: hasConnection};
            edge.end = {row: row, column: column, hasConnection: hasConnection};
        } else {
            edge.end = {row: row, column: column, hasConnection: hasConnection};
        }
    }

    private parseVerticalEdges(grid: Grid) {
        let edges = new Array<ConnectorEdge>();
        let edge: ConnectorEdge = {start: null, end: null};
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
