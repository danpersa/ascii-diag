import {Shape} from "../shapes/shape";
import {Svg} from "@svgdotjs/svg.js";

export interface SvgRenderer {
    render(shape: Shape, svg: Svg): void;
}
