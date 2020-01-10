import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Shape} from "../shapes/shape";
import {TextShape} from "../shapes/text-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {TextCreateTool} from "./text-create-tool";
import {TextDrawer} from "../drawers/text-drawer";
import {CursorDrawer} from "../drawers/cursor-drawer";
import {Text} from "../drawers/text";
import {EntitySelectionService} from "./entity-selection-service";
import {Vertex} from "../drawers/vertex";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ToolService} from "./tool-service";

export class TextEditTool extends TextCreateTool implements Tool {

    private readonly entitySelectionService: EntitySelectionService;
    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;

    private readonly currentEntity: TextShape;
    private moveVertex: Vertex;

    constructor(layerService: LayerService, toolService: ToolService, entityIdService: ShapeIdService, textDrawer: TextDrawer,
                cursorDrawer: CursorDrawer, vertexDrawer: VertexDrawer, entitySelectionService: EntitySelectionService,
                entity: TextShape) {

        super(layerService, entityIdService, textDrawer, cursorDrawer);
        this.entitySelectionService = entitySelectionService;
        this.vertexDrawer = vertexDrawer;
        this.toolService = toolService;

        this.currentEntity = entity;
        this.currentText = new Text(this.currentEntity.row, this.currentEntity.column, this.currentEntity.text);
        this.moveVertex = Vertex.fromGrid(this.currentEntity.row, this.currentEntity.column);
        this.currentEntity.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        const entity = this.layerService.getEntity(row, column);
        console.log("Entity found: " + entity);

        if (entity && entity instanceof TextShape && entity === this.currentEntity) {
            console.log("Still current entity");
            this.toolService.selectTextMoveTool(this.currentEntity);
        } else {
            if (this.currentText) {
                this.persist();
            }
            this.entitySelectionService.selectEntityFor(row, column);
        }
    }

    private updateMoveVertex() {
        if (this.currentText) {
            this.moveVertex = Vertex.fromGrid(this.currentEntity.row, this.currentEntity.column);
        }
    }

    protected addChar(char: string): void {
        super.addChar(char);
        this.updateMoveVertex();
    }

    protected removeChar(): void {
        super.removeChar();
        this.updateMoveVertex();
    }

    render(): void {
        super.render();
        if (this.currentText) {
            this.vertexDrawer.draw(this.moveVertex);
        }
    }

    persist(): void {
        if (!this.currentText) {
            return;
        }
        const entity: Shape = new TextShape(
            this.currentEntity.id(),
            this.currentText.row,
            this.currentText.column,
            this.currentText.text);

        if (this.currentText.text.length > 0) {
            this.layerService.updateEntity(entity);
            this.currentEntity.endEditing();
        } else {
            // we deleted all text, so we delete the entity
            this.layerService.deleteEntity(this.currentEntity.id());
        }
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
        if (this.moveVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
