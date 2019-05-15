import {VertexDrawer} from "./vertex-drawer";
import {Vertex} from "./vertex";
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


        const topLeftVertex = new Vertex(box.topRow, box.leftColumn);
        this.vertexDrawer.draw(topLeftVertex);

        const topRightVertex = new Vertex(box.topRow, box.rightColumn + 1);
        this.vertexDrawer.draw(topRightVertex);

        const bottomLeftVertex = new Vertex(box.bottomRow + 1, box.leftColumn);
        this.vertexDrawer.draw(bottomLeftVertex);

        const bottomRightVertex = new Vertex(box.bottomRow + 1, box.rightColumn + 1);
        this.vertexDrawer.draw(bottomRightVertex);
    }
}
