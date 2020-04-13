import {Svg} from "@svgdotjs/svg.js";
import {Constants, Shape} from "ascii-diag-renderer";
import {RefObject} from "react";
import {SvgRendererService} from "ascii-diag-renderer";

export class DiagToSvgReact {
    private readonly ref: RefObject<HTMLDivElement>;
    private readonly svgRendererService: SvgRendererService;

    constructor(ref: React.RefObject<HTMLDivElement>) {
        this.ref = ref;
        this.svgRendererService = new SvgRendererService();
    }

    render(shapes: Shape[]): void {
        const svg = new Svg('#drawing');
        svg.size(Constants.canvasWidth, Constants.canvasHeight);

        shapes.forEach((shape: Shape) => {
            this.svgRendererService.render(shape, svg);
        });

        if (this.ref.current) {
            this.ref.current.innerHTML = svg.svg();
        }
    }
}
