import {SvgRenderer} from "./svg-renderer";
import {Svg} from "@svgdotjs/svg.js";
import Constants from "../constants";
import {ArrowDirection} from "../arrow";
import {ArrowEntity} from "../entities/arrow-entity";

export class ArrowRenderer implements SvgRenderer {

    render(entity: ArrowEntity, svg: Svg): void {

        const startX = entity.startColumn * Constants.densityX;
        const startY = entity.startRow * Constants.densityY;


        const endX = entity.endColumn * Constants.densityX;
        const endY = entity.endRow * Constants.densityY;

        const midX = entity.startDirection === ArrowDirection.Horizontal ? endX : startX;
        const midY = entity.startDirection === ArrowDirection.Horizontal ? startY : endY;

        svg.polyline([startX, startY, midX, midY, endX, endY]).fill('none')
            .stroke({color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round'});
    }
}
