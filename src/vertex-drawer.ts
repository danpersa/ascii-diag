import {Vertex} from "./vertex";
import Constants from "./constants";

export class VertexDrawer {

    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    draw(vertex: Vertex) {
        this.context.fillStyle = `rgb(255, 165, 0, 1.0)`;
        this.context.fillRect(vertex.canvasX - Constants.halfVertexRadius, vertex.canvasY - Constants.halfVertexRadius, Constants.vertexRadius, Constants.vertexRadius);
    }
}
