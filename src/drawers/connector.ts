import {ConnectorShape} from "../shapes/connector-shape";

export enum ConnectorDirection {
    Horizontal,
    Vertical
}

export enum ConnectorTipDirection {
    North,
    South,
    East,
    West
}

export enum ConnectorTipStyle {
    Flat,
    Arrow
}

export enum LineStyle {
    Continuous,
    Dashed,
    Dotted
}

export type GridPoint = {
    row: number,
    column: number
}

export type GridEdge = {
    start: GridPoint,
    // end is the common grid point
    end: GridPoint
}

export interface VerticalConnector {
    verticalEdge: GridEdge;
    horizontalEdge: null;
    intersectionPoint: null;
}

export interface HorizontalConnector {
    verticalEdge: null;
    horizontalEdge: GridEdge;
    intersectionPoint: null;
}

export interface PointConnector {
    verticalEdge: null;
    horizontalEdge: null;
    intersectionPoint: GridPoint;
}

export interface EdgedConnector {
    verticalEdge: GridEdge;
    horizontalEdge: GridEdge;
    intersectionPoint: GridPoint;
}

export function isIntersectedConnector(object: ConnectorType): object is IntersectedConnector {
    return object.intersectionPoint !== null;
}

export function isVerticalConnector(object: ConnectorType): object is VerticalConnector {
    return object.verticalEdge !== null && object.horizontalEdge === null;
}

export function isHorizontalConnector(object: ConnectorType): object is HorizontalConnector {
    return object.horizontalEdge !== null && object.verticalEdge === null;
}

export function isEdgedConnector(object: ConnectorType): object is EdgedConnector {
    return object.horizontalEdge !== null && object.verticalEdge !== null;
}

export function isPointConnector(object: ConnectorType): object is PointConnector {
    return object.horizontalEdge === null && object.verticalEdge === null && object.intersectionPoint !== null;
}

export type IntersectedConnector = PointConnector | EdgedConnector

export type ConnectorType = VerticalConnector | HorizontalConnector | PointConnector | EdgedConnector

export function createConnectorType(horizontalEdgeStartPoint: GridPoint,
                                    intersectionPoint: GridPoint,
                                    verticalEdgeStartPoint: GridPoint): ConnectorType {
    // the connector is only a point
    if (horizontalEdgeStartPoint.row === verticalEdgeStartPoint.row && horizontalEdgeStartPoint.column === verticalEdgeStartPoint.column) {
        return {horizontalEdge: null, verticalEdge: null, intersectionPoint: intersectionPoint};
    } else if (horizontalEdgeStartPoint.row === verticalEdgeStartPoint.row) {
        // the connector is only horizontal
        const horizontalEdge: GridEdge = {start: horizontalEdgeStartPoint, end: verticalEdgeStartPoint};
        return {horizontalEdge: horizontalEdge, verticalEdge: null, intersectionPoint: null};
    } else if (horizontalEdgeStartPoint.column === verticalEdgeStartPoint.column) {
        // the connector is only vertical
        const verticalEdge: GridEdge = {start: verticalEdgeStartPoint, end: horizontalEdgeStartPoint};
        return {horizontalEdge: null, verticalEdge: verticalEdge, intersectionPoint: null};
    } else {
        const horizontalEdge: GridEdge = {start: horizontalEdgeStartPoint, end: intersectionPoint};
        const verticalEdge: GridEdge = {start: verticalEdgeStartPoint, end: intersectionPoint};
        return {horizontalEdge: horizontalEdge, verticalEdge: verticalEdge, intersectionPoint: intersectionPoint};
    }
}

export class Connector {
    private readonly _connectorType: ConnectorType;
    private readonly _lineStyle: LineStyle;
    private readonly _horizontalTipStyle: ConnectorTipStyle;
    private readonly _verticalTipStyle: ConnectorTipStyle;

    static createByStartPoints(horizontalEdgeStartPoint: GridPoint,
                               intersectionPoint: GridPoint,
                               verticalEdgeStartPoint: GridPoint,
                               lineStyle: LineStyle = LineStyle.Continuous,
                               horizontalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                               verticalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat): Connector {
        const connectorType = createConnectorType(horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint);
        return new Connector(connectorType, lineStyle, horizontalTipStyle, verticalTipStyle);
    }

    constructor(connectorType: ConnectorType,
                lineStyle: LineStyle = LineStyle.Continuous,
                horizontalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat,
                verticalTipStyle: ConnectorTipStyle = ConnectorTipStyle.Flat) {
        this._connectorType = connectorType;
        this._lineStyle = lineStyle;
        this._horizontalTipStyle = horizontalTipStyle;
        this._verticalTipStyle = verticalTipStyle;
    }

    get verticalEdge(): GridEdge | null {
        return this._connectorType.verticalEdge;
    }

    get horizontalEdge(): GridEdge | null {
        return this._connectorType.horizontalEdge;
    }

    get intersectionPoint(): GridPoint | null {
        return this._connectorType.intersectionPoint;
    }

    get connectorType(): ConnectorType {
        return this._connectorType;
    }

    get lineStyle(): LineStyle {
        return this._lineStyle;
    }

    get horizontalTipStyle(): ConnectorTipStyle {
        return this._horizontalTipStyle;
    }

    get verticalTipStyle(): ConnectorTipStyle {
        return this._verticalTipStyle;
    }
}

export namespace Connector {

    export class Builder {
        protected _connectorType: ConnectorType;
        protected _lineStyle: LineStyle;
        protected _horizontalTipStyle: ConnectorTipStyle;
        protected _verticalTipStyle: ConnectorTipStyle;

        protected constructor(connectorType: ConnectorType,
                              lineStyle: LineStyle,
                              horizontalTipStyle: ConnectorTipStyle,
                              verticalTipStyle: ConnectorTipStyle) {
            this._connectorType = connectorType;
            this._lineStyle = lineStyle;
            this._horizontalTipStyle = horizontalTipStyle;
            this._verticalTipStyle = verticalTipStyle;
        }

        static from(connector: Connector): Builder {
            return new Builder(
                connector.connectorType,
                connector.lineStyle,
                connector.horizontalTipStyle,
                connector.verticalTipStyle);
        }

        static fromShape(shape: ConnectorShape): Builder {
            return new Builder(
                shape.connectorType,
                shape.lineStyle,
                shape.horizontalTipStyle,
                shape.verticalTipStyle);
        }

        build(): Connector {

            return new Connector(
                this._connectorType,
                this._lineStyle,
                this._horizontalTipStyle,
                this._verticalTipStyle);
        }

        connectorType(value: ConnectorType) {
            this._connectorType = value;
            return this;
        }

        lineStyle(value: LineStyle) {
            this._lineStyle = value;
            return this;
        }

        horizontalTipStyle(value: ConnectorTipStyle) {
            this._horizontalTipStyle = value;
            return this;
        }

        verticalTipStyle(value: ConnectorTipStyle) {
            this._verticalTipStyle = value;
            return this;
        }
    }
}