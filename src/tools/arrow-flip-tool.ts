import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawer/vertex-drawer";
import {ArrowEntity} from "../entities/arrow-entity";
import {Vertex} from "../drawer/vertex";
import {ArrowDirection} from "../drawer/arrow";
import {LayerService} from "../layer-service";
import {ArrowVertexFactory} from "./arrow-vertex-factory";

export class ArrowFlipTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly arrowVertexFactory: ArrowVertexFactory;

    private readonly entity: ArrowEntity;
    private readonly flipVertex: Vertex | null;

    constructor(toolService: ToolService, layerService: LayerService, vertexDrawer: VertexDrawer,
                arrowVertexFactory: ArrowVertexFactory, entity: ArrowEntity) {
        this.toolService = toolService;
        this.vertexDrawer = vertexDrawer;
        this.entity = entity;
        this.layerService = layerService;
        this.arrowVertexFactory = arrowVertexFactory;
        this.flipVertex = arrowVertexFactory.createFlipVertex(entity);
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
        const newArrowDirection = this.entity.startDirection === ArrowDirection.Horizontal ? ArrowDirection.Vertical : ArrowDirection.Horizontal;

        const entity = new ArrowEntity(
            this.entity.id(),
            this.entity.startRow,
            this.entity.startColumn,
            this.entity.endRow,
            this.entity.endColumn,
            newArrowDirection
        );

        this.layerService.updateEntity(entity);
        this.toolService.selectArrowEditTool(entity);
    }

    keyDown(key: string): void {
    }

    persist(): void {
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
