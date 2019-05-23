import {VertexDrawer} from "./vertex-drawer";
import {SelectBox} from "./select-box";
import Constants from "./constants";


export class SelectBoxDrawer {

    private readonly context: CanvasRenderingContext2D;
    private readonly vertexDrawer: VertexDrawer;

    constructor(context: CanvasRenderingContext2D, vertexDrawer: VertexDrawer) {
        this.context = context;
        this.vertexDrawer = vertexDrawer;
    }

    draw(box: SelectBox): void {
        this.context.strokeStyle = Constants.accentColor;
        this.context.lineWidth = 1.0;
        this.context.strokeRect(box.canvasX, box.canvasY, box.canvasWidth, box.canvasHeight);
        this.vertexDrawer.draw(box.topLeftVertex);
        this.vertexDrawer.draw(box.topRightVertex);
        this.vertexDrawer.draw(box.bottomLeftVertex);
        this.vertexDrawer.draw(box.bottomRightVertex);
        this.vertexDrawer.draw(box.centerVertex);
    }
}
