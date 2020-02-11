import {VertexDrawer} from "./vertex-drawer";
import {SelectBox} from "./select-box";
import Constants from "../constants";
import Has2DContext from "../has-2d-context";

export interface SelectBoxDrawer {
    draw(box: SelectBox): void
}

export class CanvasSelectBoxDrawer implements SelectBoxDrawer, Has2DContext {

    readonly canvasRef: React.RefObject<HTMLCanvasElement>;
    private readonly vertexDrawer: VertexDrawer;

    constructor(canvasRef: React.RefObject<HTMLCanvasElement>, vertexDrawer: VertexDrawer) {
        this.canvasRef = canvasRef;
        this.vertexDrawer = vertexDrawer;
    }

    draw(box: SelectBox): void {
        this.getContext().strokeStyle = Constants.accentColor;
        this.getContext().lineWidth = 1.0;
        this.getContext().strokeRect(box.canvasX, box.canvasY, box.canvasWidth, box.canvasHeight);
        this.vertexDrawer.draw(box.topLeftVertex);
        this.vertexDrawer.draw(box.topRightVertex);
        this.vertexDrawer.draw(box.bottomLeftVertex);
        this.vertexDrawer.draw(box.bottomRightVertex);
        this.vertexDrawer.draw(box.centerVertex);
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvasRef.current!.getContext("2d")!;
    }
}
