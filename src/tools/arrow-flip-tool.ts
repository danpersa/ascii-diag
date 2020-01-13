import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ArrowShape} from "../shapes/arrow-shape";
import {Vertex} from "../drawers/vertex";
import {ArrowDirection} from "../drawers/arrow";
import {LayerService} from "../layer-service";
import {ArrowVertexFactory} from "./arrow-vertex-factory";

export class ArrowFlipTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly arrowVertexFactory: ArrowVertexFactory;

    private readonly shape: ArrowShape;
    private readonly flipVertex: Vertex | null;

    constructor(toolService: ToolService, layerService: LayerService, vertexDrawer: VertexDrawer,
                arrowVertexFactory: ArrowVertexFactory, shape: ArrowShape) {
        this.toolService = toolService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.layerService = layerService;
        this.arrowVertexFactory = arrowVertexFactory;
        this.flipVertex = arrowVertexFactory.createFlipVertex(shape);
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
    }

    render() {
        if (this.flipVertex) {
            this.vertexDrawer.draw(this.flipVertex);
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        document.body.style.cursor = 'pointer';
    }

    mouseUp(row: number, column: number): void {
        const newArrowDirection = this.shape.startDirection === ArrowDirection.Horizontal ? ArrowDirection.Vertical : ArrowDirection.Horizontal;

        const shape = new ArrowShape(
            this.shape.id(),
            this.shape.startRow,
            this.shape.startColumn,
            this.shape.endRow,
            this.shape.endColumn,
            newArrowDirection
        );

        this.layerService.updateShape(shape);
        this.toolService.selectArrowEditTool(shape);
    }

    keyDown(key: string): void {
    }

    persist(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
