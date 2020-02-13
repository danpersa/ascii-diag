import Constants from "../constants";
import {BoxShape} from "../shapes/box-shape";
import {SvgRenderer} from "./svg-renderer";
import {Svg} from "@svgdotjs/svg.js";
import {BoxCornerStyle} from "../drawers/box";

export class BoxRenderer implements SvgRenderer {

    render(shape: BoxShape, svg: Svg): void {
        const rectWidth = (shape.rightColumn - shape.leftColumn) * Constants.densityX;
        const rectHeight = (shape.bottomRow - shape.topRow) * Constants.densityY;
        const rect = svg.rect(rectWidth, rectHeight).fill('none')
            .stroke({color: '#333333', width: 1.5});
        rect.center(shape.leftColumn * Constants.densityX + ((shape.rightColumn - shape.leftColumn) / 2) * Constants.densityX,
            (shape.topRow) * Constants.densityY + ((shape.bottomRow - shape.topRow) / 2) * Constants.densityY);

        if (shape.cornerStyle === BoxCornerStyle.Rounded) {
            rect.radius(5, 10);
        }
    }
}
