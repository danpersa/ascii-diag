import {Vertex} from "./vertex";
import Constants from "../constants";

export interface VertexDrawer {
    draw(vertex: Vertex): void
}

export class CanvasVertexDrawer implements VertexDrawer {

    readonly canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        this.canvasRef = canvasRef;
    }

    draw(vertex: Vertex) {
        this.getContext().fillStyle = `rgb(255, 165, 0, 1.0)`;
        this.getContext().fillRect(vertex.canvasX - Constants.halfVertexRadius, vertex.canvasY - Constants.halfVertexRadius, Constants.vertexRadius, Constants.vertexRadius);
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvasRef.current!.getContext("2d")!;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvasRef.current!;
    }
}
