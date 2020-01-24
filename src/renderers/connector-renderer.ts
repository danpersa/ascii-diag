import {SvgRenderer} from "./svg-renderer";
import {Polygon, Svg} from "@svgdotjs/svg.js";
import Constants from "../constants";
import {ConnectorDirection, ConnectorTipDirection} from "../drawers/connector";
import {ConnectorShape} from "../shapes/connector-shape";
import {ConnectorTipDirectionService} from "../connector-tip-direction-service";

type TipOffset = { rowsOffset: number, columnsOffset: number };

export class ConnectorRenderer implements SvgRenderer {

    private readonly connectorTipDirectionService: ConnectorTipDirectionService;

    constructor(connectorTipDirectionService: ConnectorTipDirectionService) {
        this.connectorTipDirectionService = connectorTipDirectionService;
    }

    render(shape: ConnectorShape, svg: Svg): void {
        const startTipDirection = this.connectorTipDirectionService.startTipDirection(shape);
        const endTipDirection = this.connectorTipDirectionService.endTipDirection(shape);
        const startOffset = ConnectorRenderer.tipOffset(startTipDirection);
        const endOffset = ConnectorRenderer.tipOffset(endTipDirection);


        const startX = (shape.startColumn + startOffset.columnsOffset) * Constants.densityX;
        const startY = (shape.startRow + startOffset.rowsOffset) * Constants.densityY;

        const endX = (shape.endColumn + endOffset.columnsOffset) * Constants.densityX;
        const endY = (shape.endRow + endOffset.rowsOffset) * Constants.densityY;

        const midX = shape.startDirection === ConnectorDirection.Horizontal ? endX : startX;
        const midY = shape.startDirection === ConnectorDirection.Horizontal ? startY : endY;

        svg.polyline([startX, startY, midX, midY, endX, endY]).fill('none')
            .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'});

        if (endTipDirection !== null) {
            const tip = ConnectorRenderer.renderTip(endX, endY, svg);

            switch (endTipDirection) {
                case ConnectorTipDirection.North:
                    tip.rotate(0)
                        .move(endX - 3, endY);
                    break;
                case ConnectorTipDirection.South:
                    tip.rotate(180);
                    break;
                case ConnectorTipDirection.East:
                    tip.rotate(90)
                        .move(endX + 3, endY - 6);
                    break;
                case ConnectorTipDirection.West:
                    tip.rotate(270)
                        .move(endX - 9, endY - 6);
                    break;
            }
        }

        if (startTipDirection !== null) {
            const tip = ConnectorRenderer.renderTip(startX, startY, svg);

            switch (startTipDirection) {
                case ConnectorTipDirection.North:
                    tip.rotate(0)
                        .move(startX - 3, startY);
                    break;
                case ConnectorTipDirection.South:
                    tip.rotate(180);
                    break;
                case ConnectorTipDirection.East:
                    tip.rotate(90)
                        .move(startX + 3, startY - 6);
                    break;
                case ConnectorTipDirection.West:
                    tip.rotate(270)
                        .move(startX - 9, startY - 6);
                    break;
            }
        }
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

    private static renderTip(x: number, y: number, svg: Svg): Polygon {
        return svg.polygon([x, y - 12, x + 3, y, x - 3, y])
            .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'})
    }
}
