import {SvgRenderer} from "./svg-renderer";
import {Svg} from "@svgdotjs/svg.js";
import {Constants} from "../constants";
import {LineStyle} from "../entities/connector";
import {BoxCornerStyle} from "../entities/box";
import {BoxShape} from "../shapes/box-shape";

export class BoxRenderer implements SvgRenderer {

    render(shape: BoxShape, svg: Svg): void {
        const rectWidth = (shape.rightColumn - shape.leftColumn) * Constants.densityX;
        const rectHeight = (shape.bottomRow - shape.topRow) * Constants.densityY;

        const dasharray = this.dasharray(shape);
        const stroke = {color: '#333333', width: 1.5, linecap: 'round', linejoin: 'round', dasharray: dasharray};

        const rect = svg.rect(rectWidth, rectHeight).fill('none')
            .stroke(stroke);
        rect.center(shape.leftColumn * Constants.densityX + ((shape.rightColumn - shape.leftColumn) / 2) * Constants.densityX,
            (shape.topRow) * Constants.densityY + ((shape.bottomRow - shape.topRow) / 2) * Constants.densityY);

        if (shape.cornerStyle === BoxCornerStyle.Rounded) {
            rect.radius(5, 10);
        }
    }

    private dasharray(shape: BoxShape) {
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
}
