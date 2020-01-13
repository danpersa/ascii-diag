import {SvgRenderer} from "./svg-renderer";
import {Polygon, Svg} from "@svgdotjs/svg.js";
import Constants from "../constants";
import {ArrowDirection, ArrowTipDirection} from "../drawers/arrow";
import {ArrowShape} from "../shapes/arrow-shape";
import {ArrowTipDirectionService} from "../arrow-tip-direction-service";

export class ArrowRenderer implements SvgRenderer {

    private readonly arrowTipDirectionService: ArrowTipDirectionService;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
    }

    render(shape: ArrowShape, svg: Svg): void {

        const startX = shape.startColumn * Constants.densityX;
        const startY = shape.startRow * Constants.densityY;


        const endX = shape.endColumn * Constants.densityX;
        const endY = shape.endRow * Constants.densityY;

        const midX = shape.startDirection === ArrowDirection.Horizontal ? endX : startX;
        const midY = shape.startDirection === ArrowDirection.Horizontal ? startY : endY;

        svg.polyline([startX, startY, midX, midY, endX, endY]).fill('none')
            .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'});

        const tipDirection = this.arrowTipDirectionService.endTipDirection(shape);

        if (tipDirection !== null) {
            const arrowTip = this.renderArrowTip(endX, endY, svg);

            switch (tipDirection) {
                case ArrowTipDirection.North:
                    arrowTip.rotate(0)
                        .move(endX - 3, endY);
                    break;
                case ArrowTipDirection.South:
                    arrowTip.rotate(180);
                    break;
                case ArrowTipDirection.East:
                    arrowTip.rotate(90)
                        .move(endX + 3, endY - 6);
                    break;
                case ArrowTipDirection.West:
                    arrowTip.rotate(270)
                        .move(endX - 9, endY - 6);
                    break;
            }
        }
    }


    private renderArrowTip(x: number, y: number, svg: Svg): Polygon {
        return svg.polygon([x, y - 12, x + 3, y, x - 3, y])
            .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'})
    }
}
