import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {EntitySelectionService} from "./entity-selection-service";
import {VertexDrawer} from "../vertex-drawer";
import {ArrowEntity} from "../entities/arrow-entity";
import {Vertex} from "../vertex";
import {ArrowVertexFactory} from "./arrow-vertex-factory";
import {ArrowModifyType} from "./arrow-modify-tool";
import {LayerService} from "../layer-service";

export class ArrowEditTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly entitySelectionService: EntitySelectionService;

    private readonly entity: ArrowEntity;
    private readonly flipVertex: Vertex | null;
    private readonly startArrowVertex: Vertex;
    private readonly endArrowVertex: Vertex;

    constructor(toolService: ToolService, layerService: LayerService, entitySelectionService: EntitySelectionService,
                vertexDrawer: VertexDrawer,
                arrowVertexFactory: ArrowVertexFactory, entity: ArrowEntity) {
        this.toolService = toolService;
        this.layerService = layerService;
        this.vertexDrawer = vertexDrawer;
        this.entity = entity;
        this.entitySelectionService = entitySelectionService;
        this.flipVertex = arrowVertexFactory.createFlipVertex(entity);
        this.startArrowVertex = arrowVertexFactory.createStartArrowVertex(entity);
        this.endArrowVertex = arrowVertexFactory.createEndArrowVertex(entity);
    }


    mouseDown(row: number, column: number, x: number, y: number): void {
        console.log("Arrow Edit Tool click on row: " + row + " column=" + column);

        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            this.toolService.selectArrowFlipTool(this.entity)
        } else if (this.startArrowVertex.containsPoint(x, y)) {
            this.toolService.selectArrowModifyTool(this.entity, ArrowModifyType.StartMove);
        } else if (this.endArrowVertex.containsPoint(x, y)) {
            this.toolService.selectArrowModifyTool(this.entity, ArrowModifyType.EndMove);
        } else {
            this.entitySelectionService.selectEntityFor(row, column);
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
            this.layerService.deleteEntity(this.entity.id());
            this.toolService.selectSelectTool();
        }
    }

    persist(): void {
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'pointer';
        } else if (this.startArrowVertex.containsPoint(x, y) || this.endArrowVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
