import {SvgRenderer} from "./svg-renderer";
import {Svg} from "@svgdotjs/svg.js";
import Constants from "../constants";
import {TextShape} from "../shapes/text-shape";

export class TextRenderer implements SvgRenderer {

    render(entity: TextShape, svg: Svg): void {
        const startX = (entity.column - 0.5) * Constants.densityX;
        const startY = (entity.row + 0.2) * Constants.densityY;
        svg.text(add => {
            add.tspan(entity.text)
        }).font({
            family: 'Courier',
            size: 16.5,
        }).amove(startX, startY);
    }
}
