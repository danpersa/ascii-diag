import {SvgRenderer} from "./svg-renderer";
import {Svg} from "@svgdotjs/svg.js";
import {Constants} from "../constants";
import {
    ConnectorTipDirection,
    ConnectorTipStyle,
    EdgedConnector,
    HorizontalConnector,
    IntersectedConnector,
    isEdgedConnector,
    isHorizontalConnector,
    isIntersectedConnector,
    isVerticalConnector,
    LineStyle,
    VerticalConnector
} from "../entities/connector";
import {ConnectorShape} from "../shapes/connector-shape";

type TipOffset = { rowsOffset: number, columnsOffset: number };
type CanvasPoint = { x: number, y: number };

export class ConnectorRenderer implements SvgRenderer {

    constructor() {
    }

    render(shape: ConnectorShape, svg: Svg): void {
        const linePoints: number[] = [];
        const connectorType = shape.connectorType;

        if (isHorizontalConnector(connectorType) || isEdgedConnector(connectorType)) {
            const direction = this.horizontalStartTipDirection(connectorType);
            const point = this.startHorizontalPoint(connectorType, direction);
            linePoints.push(point.x, point.y);
            if (shape.horizontalTipStyle === ConnectorTipStyle.Arrow) {
                ConnectorRenderer.renderTip(point, direction, svg);
            }
        }

        if (isHorizontalConnector(connectorType)) {
            const direction = this.horizontalEndTipDirection(connectorType);
            const point = this.endHorizontalPoint(connectorType, direction)
            linePoints.push(point.x, point.y);
            if (shape.verticalTipStyle === ConnectorTipStyle.Arrow) {
                ConnectorRenderer.renderTip(point, direction, svg);
            }
        }

        if (isIntersectedConnector(connectorType)) {
            this.addIntersectionPointToLine(connectorType, linePoints);
        }

        if (isVerticalConnector(connectorType) || isEdgedConnector(connectorType)) {
            const direction = this.verticalStartTipDirection(connectorType);
            const point = this.startVerticalPoint(connectorType, direction);
            linePoints.push(point.x, point.y);
            if (shape.verticalTipStyle === ConnectorTipStyle.Arrow) {
                ConnectorRenderer.renderTip(point, direction, svg);
            }
        }

        if (isVerticalConnector(connectorType)) {
            const direction = this.verticalEndTipDirection(connectorType);
            const point = this.endVerticalPoint(connectorType, direction);
            linePoints.push(point.x, point.y);
            if (shape.horizontalTipStyle === ConnectorTipStyle.Arrow) {
                ConnectorRenderer.renderTip(point, direction, svg);
            }
        }

        const dasharray = this.dasharray(shape);
        const stroke = {color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round', dasharray: dasharray};

        svg.polyline(linePoints).fill('none')
            .stroke(stroke);
    }

    private dasharray(shape: ConnectorShape) {
        switch (shape.lineStyle) {
            case LineStyle.Continuous:
                return Constants.continuousLineDashPattern;
            case LineStyle.Dashed:
                return Constants.dashedLineDashPattern;
            case LineStyle.Dotted:
                return Constants.dottedLineDashPattern;
        }
        return Constants.continuousLineDashPattern;
    }

    private horizontalStartTipDirection(connectorType: HorizontalConnector | EdgedConnector): ConnectorTipDirection | null {
        if (connectorType.horizontalEdge.start.column < connectorType.horizontalEdge.end.column) {
            return ConnectorTipDirection.West;
        } else {
            return ConnectorTipDirection.East;
        }
    }

    private horizontalEndTipDirection(connectorType: HorizontalConnector): ConnectorTipDirection | null {
        if (connectorType.horizontalEdge.end.column < connectorType.horizontalEdge.start.column) {
            return ConnectorTipDirection.West;
        } else {
            return ConnectorTipDirection.East;
        }
    }

    private verticalStartTipDirection(connectorType: VerticalConnector | EdgedConnector): ConnectorTipDirection | null {
        if (connectorType.verticalEdge.start.row < connectorType.verticalEdge.end.row) {
            return ConnectorTipDirection.North;
        } else {
            return ConnectorTipDirection.South;
        }
    }

    private verticalEndTipDirection(connectorType: VerticalConnector): ConnectorTipDirection | null {
        if (connectorType.verticalEdge.end.row < connectorType.verticalEdge.start.row) {
            return ConnectorTipDirection.North;
        } else {
            return ConnectorTipDirection.South;
        }
    }

    private static renderTip(point: CanvasPoint, direction: ConnectorTipDirection | null, svg: Svg) {
        const tip = svg.polygon([point.x, point.y - 12, point.x + 3, point.y, point.x - 3, point.y])
            .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'});

        switch (direction) {
            case ConnectorTipDirection.North:
                tip.rotate(0)
                    .move(point.x - 3, point.y);
                break;
            case ConnectorTipDirection.South:
                tip.rotate(180);
                break;
            case ConnectorTipDirection.East:
                tip.rotate(90)
                    .move(point.x + 3, point.y - 6);
                break;
            case ConnectorTipDirection.West:
                tip.rotate(270)
                    .move(point.x - 9, point.y - 6);
                break;
        }
    }

    private startHorizontalPoint(connectorType: HorizontalConnector | EdgedConnector, direction: ConnectorTipDirection | null): CanvasPoint {
        const startOffset = ConnectorRenderer.tipOffset(direction);
        const startRow = connectorType.horizontalEdge.start.row;
        const startColumn = connectorType.horizontalEdge.start.column;
        const startX = (startColumn + startOffset.columnsOffset) * Constants.densityX;
        const startY = (startRow + startOffset.rowsOffset) * Constants.densityY;
        return {x: startX, y: startY};
    }

    private endHorizontalPoint(connectorType: HorizontalConnector, direction: ConnectorTipDirection | null): CanvasPoint {
        const endOffset = ConnectorRenderer.tipOffset(direction);
        const endRow = connectorType.horizontalEdge.end.row;
        const endColumn = connectorType.horizontalEdge.end.column;
        const endX = (endColumn + endOffset.columnsOffset) * Constants.densityX;
        const endY = (endRow + endOffset.rowsOffset) * Constants.densityY;
        return {x: endX, y: endY};
    }

    private startVerticalPoint(connectorType: VerticalConnector | EdgedConnector, direction: ConnectorTipDirection | null): CanvasPoint {
        const startOffset = ConnectorRenderer.tipOffset(direction);
        const startRow = connectorType.verticalEdge.start.row;
        const startColumn = connectorType.verticalEdge.start.column;
        const startX = (startColumn + startOffset.columnsOffset) * Constants.densityX;
        const startY = (startRow + startOffset.rowsOffset) * Constants.densityY;
        return {x: startX, y: startY};
    }

    private endVerticalPoint(connectorType: VerticalConnector, direction: ConnectorTipDirection | null): CanvasPoint {
        const endOffset = ConnectorRenderer.tipOffset(direction);
        const endRow = connectorType.verticalEdge.end.row;
        const endColumn = connectorType.verticalEdge.end.column;
        const endX = (endColumn + endOffset.columnsOffset) * Constants.densityX;
        const endY = (endRow + endOffset.rowsOffset) * Constants.densityY;
        return {x: endX, y: endY};
    }

    private static tipOffset(tipDirection: ConnectorTipDirection | null): TipOffset {
        if (tipDirection != null) {
            switch (tipDirection) {
                case ConnectorTipDirection.North:
                    return {rowsOffset: -1, columnsOffset: 0};
                case ConnectorTipDirection.South:
                    return {rowsOffset: 1, columnsOffset: 0};
                case ConnectorTipDirection.East:
                    return {rowsOffset: 0, columnsOffset: 1};
                case ConnectorTipDirection.West:
                    return {rowsOffset: 0, columnsOffset: -1};
            }
        }
        return {rowsOffset: 0, columnsOffset: 0};
    }

    private addIntersectionPointToLine(connectorType: IntersectedConnector, linePoints: number[]) {
        const row = connectorType.intersectionPoint.row;
        const column = connectorType.intersectionPoint.column;
        const startX = (column) * Constants.densityX;
        const startY = row * Constants.densityY;

        linePoints.push(startX, startY);
    }
}
