import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ArrowShape} from "../shapes/arrow-shape";
import {Vertex} from "../drawers/vertex";
import {ArrowVertexFactory} from "./arrow-vertex-factory";
import {ArrowModifyType} from "./arrow-modify-tool";
import {LayerService} from "../layer-service";

export class ArrowEditTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;

    private readonly shape: ArrowShape;
    private readonly flipVertex: Vertex | null;
    private readonly startArrowVertex: Vertex;
    private readonly endArrowVertex: Vertex;

    constructor(toolService: ToolService, layerService: LayerService,
                vertexDrawer: VertexDrawer,
                arrowVertexFactory: ArrowVertexFactory, shape: ArrowShape) {
        this.toolService = toolService;
        this.layerService = layerService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.flipVertex = arrowVertexFactory.createFlipVertex(shape);
        this.startArrowVertex = arrowVertexFactory.createStartArrowVertex(shape);
        this.endArrowVertex = arrowVertexFactory.createEndArrowVertex(shape);
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        console.log("Arrow Edit Tool click on row: " + row + " column=" + column);

        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            this.toolService.selectArrowFlipTool(this.shape)
        } else if (this.startArrowVertex.containsPoint(x, y)) {
            this.toolService.selectArrowModifyTool(this.shape, ArrowModifyType.StartMove);
        } else if (this.endArrowVertex.containsPoint(x, y)) {
            this.toolService.selectArrowModifyTool(this.shape, ArrowModifyType.EndMove);
        } else {
            this.toolService.selectShapeFor(row, column);
        }
    }

    render() {
        if (this.flipVertex) {
            this.vertexDrawer.draw(this.flipVertex);
        }
        this.vertexDrawer.draw(this.startArrowVertex);
        this.vertexDrawer.draw(this.endArrowVertex);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
    }

    mouseUp(row: number, column: number): void {
    }

    keyDown(key: string): void {
        if (key === "Backspace" || key === "Delete") {
            this.layerService.deleteShape(this.shape.id());
            this.toolService.selectSelectTool();
        }
    }

    persist(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'pointer';
        } else if (this.startArrowVertex.containsPoint(x, y) || this.endArrowVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
