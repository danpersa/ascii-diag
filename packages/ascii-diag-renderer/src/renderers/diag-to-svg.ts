import {Svg} from "@svgdotjs/svg.js";
import {Constants} from "../constants";
import {SvgRendererService} from "./svg-renderer-service";
import {Shape} from "../shapes/shape";

export class DiagToSvg {
    private readonly svgRendererService: SvgRendererService;

    constructor() {
        this.svgRendererService = new SvgRendererService();
    }

    render(shapes: Shape[]): Svg {
        const svg = new Svg('#drawing');
        svg.size(Constants.canvasWidth, Constants.canvasHeight);

        shapes.forEach((shape: Shape) => {
            this.svgRendererService.render(shape, svg);
        });

        return svg;
    }
}
