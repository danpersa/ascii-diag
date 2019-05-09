import {Vertex} from "./vertex";

export class VertexDrawer {

    private readonly context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    draw(vertex: Vertex) {
        this.context.fillStyle = `rgb(255, 165, 0, 1.0)`;
        this.context.fillRect(vertex.canvasX - 3, vertex.canvasY - 3, 6, 6);
    }
}
