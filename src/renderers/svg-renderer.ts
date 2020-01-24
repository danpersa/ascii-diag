import {Shape} from "../shapes/shape";
import {Svg} from "@svgdotjs/svg.js";
import {BoxShape} from "../shapes/box-shape";
import {ArrowShape} from "../shapes/arrow-shape";
import {TextShape} from "../shapes/text-shape";
import {ArrowRenderer} from "./arrow-renderer";
import {BoxRenderer} from "./box-renderer";
import {TextRenderer} from "./text-renderer";
import {ArrowTipDirectionService} from "../arrow-tip-direction-service";

export interface SvgRenderer {

    render(shape: Shape, svg: Svg): void;
}

export class SvgRendererService {

    private readonly boxRenderer: SvgRenderer;
    private readonly arrowRenderer: SvgRenderer;
    private readonly textRenderer: SvgRenderer;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowRenderer = new ArrowRenderer(arrowTipDirectionService);
        this.boxRenderer = new BoxRenderer();
        this.textRenderer = new TextRenderer();
    }

    render(shape: Shape, svg: Svg) {
        if (shape instanceof BoxShape) {
            this.boxRenderer.render(shape, svg);
        } else if (shape instanceof ArrowShape) {
            this.arrowRenderer.render(shape, svg);
        } else if (shape instanceof TextShape) {
            this.textRenderer.render(shape, svg);
        }
    }
}
