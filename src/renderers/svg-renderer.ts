import {Shape} from "../shapes/shape";
import {Svg} from "@svgdotjs/svg.js";
import {BoxShape} from "../shapes/box-shape";
import {ConnectorShape} from "../shapes/connector-shape";
import {TextShape} from "../shapes/text-shape";
import {ConnectorRenderer} from "./connector-renderer";
import {BoxRenderer} from "./box-renderer";
import {TextRenderer} from "./text-renderer";
import {ConnectorTipDirectionService} from "../connector-tip-direction-service";

export interface SvgRenderer {

    render(shape: Shape, svg: Svg): void;
}

export class SvgRendererService {

    private readonly boxRenderer: SvgRenderer;
    private readonly connectorRenderer: SvgRenderer;
    private readonly textRenderer: SvgRenderer;

    constructor(connectorTipDirectionService: ConnectorTipDirectionService) {
        this.connectorRenderer = new ConnectorRenderer(connectorTipDirectionService);
        this.boxRenderer = new BoxRenderer();
        this.textRenderer = new TextRenderer();
    }

    render(shape: Shape, svg: Svg) {
        if (shape instanceof BoxShape) {
            this.boxRenderer.render(shape, svg);
        } else if (shape instanceof ConnectorShape) {
            this.connectorRenderer.render(shape, svg);
        } else if (shape instanceof TextShape) {
            this.textRenderer.render(shape, svg);
        }
    }
}
