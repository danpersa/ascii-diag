import Constants from "../constants";
import {BoxShape} from "../shapes/box-shape";
import {SvgRenderer} from "./svg-renderer";
import {Svg} from "@svgdotjs/svg.js";

export class BoxRenderer implements SvgRenderer {

    render(entity: BoxShape, svg: Svg): void {
        const rectWidth = (entity.rightColumn - entity.leftColumn) * Constants.densityX;
        const rectHeight = (entity.bottomRow - entity.topRow) * Constants.densityY;
        const rect = svg.rect(rectWidth, rectHeight).fill('none')
            .stroke({color: '#333333', width: 1.5});
        rect.center(entity.leftColumn * Constants.densityX + ((entity.rightColumn - entity.leftColumn) / 2) * Constants.densityX,
            (entity.topRow) * Constants.densityY + ((entity.bottomRow - entity.topRow) / 2) * Constants.densityY);
    }
}
