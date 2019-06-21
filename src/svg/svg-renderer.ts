import {Entity} from "../entities/entity";
import {Svg} from "@svgdotjs/svg.js";
import {BoxEntity} from "../entities/box-entity";
import {ArrowEntity} from "../entities/arrow-entity";
import {TextEntity} from "../entities/text-entity";
import {ArrowRenderer} from "./arrow-renderer";
import {BoxRenderer} from "./box-renderer";
import {TextRenderer} from "./text-renderer";

export interface SvgRenderer {

    render(entity: Entity, svg: Svg): void;
}

export class SvgRendererService {

    private readonly boxRenderer: SvgRenderer;
    private readonly arrowRenderer: SvgRenderer;
    private readonly textRenderer: SvgRenderer;

    constructor() {
        this.arrowRenderer = new ArrowRenderer();
        this.boxRenderer = new BoxRenderer();
        this.textRenderer = new TextRenderer();
    }

    render(entity: Entity, svg: Svg) {
        if (entity instanceof BoxEntity) {
            this.boxRenderer.render(entity, svg);
        } else if (entity instanceof ArrowEntity) {
            this.arrowRenderer.render(entity, svg);
        } else if (entity instanceof TextEntity) {
            this.textRenderer.render(entity, svg);
        }
    }
}
