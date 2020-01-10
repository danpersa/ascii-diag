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

    render(entity: Shape, svg: Svg): void;
}

export class SvgRendererService {

    private readonly boxRenderer: SvgRenderer;
    private readonly arrowRenderer: SvgRenderer;
    private readonly textRenderer: SvgRenderer;

    constructor() {
        this.arrowRenderer = new ArrowRenderer(new ArrowTipDirectionService());
        this.boxRenderer = new BoxRenderer();
        this.textRenderer = new TextRenderer();
    }

    render(entity: Shape, svg: Svg) {
        if (entity instanceof BoxShape) {
            this.boxRenderer.render(entity, svg);
        } else if (entity instanceof ArrowShape) {
            this.arrowRenderer.render(entity, svg);
        } else if (entity instanceof TextShape) {
            this.textRenderer.render(entity, svg);
        }
    }
}
