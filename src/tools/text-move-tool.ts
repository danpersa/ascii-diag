import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import Constants from "../constants";
import {BoxDrawer} from "../box-drawer";
import {ToolService} from "./tool-service";
import {TextEntity} from "../entities/text-entity";
import {Vertex} from "../vertex";
import {VertexDrawer} from "../vertex-drawer";
import {Text} from "../text";
import {TextDrawer} from "../text-drawer";

export class TextMoveTool implements Tool {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private readonly vertexDrawer: VertexDrawer;
    private readonly textDrawer: TextDrawer;

    private readonly currentEntity: TextEntity;
    protected currentText: Text;
    private moveVertex: Vertex;

    constructor(layerService: LayerService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer,
                boxDrawer: BoxDrawer, vertexDrawer: VertexDrawer, textDrawer: TextDrawer, entity: TextEntity) {

        this.layerService = layerService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.vertexDrawer = vertexDrawer;
        this.textDrawer = textDrawer;

        this.currentEntity = entity;
        this.currentText = new Text(this.currentEntity.row, this.currentEntity.column, this.currentEntity.text);
        this.moveVertex = Vertex.fromGrid(this.currentEntity.row, this.currentEntity.column);
        this.currentEntity.startEditing();
    }

    private fromCanvasToVertexPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        const [vertexRow, vertexColumn] = this.fromCanvasToVertexPos(x, y);
        this.moveVertex = Vertex.fromGrid(vertexRow, vertexColumn);
        this.currentText = new Text(vertexRow, vertexColumn, this.currentEntity.text);
        document.body.style.cursor = 'move';
    }

    mouseUp(row: number, column: number): void {
        this.currentEntity.endEditing();
        this.persist();
    }

    keyDown(key: string): void {
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
    }

    persist(): void {
        const entity = new TextEntity(
            this.currentEntity.id(),
            this.currentText.row,
            this.currentText.column,
            this.currentEntity.text);
        this.layerService.updateEntity(entity);
        this.toolService.selectTextEditTool(entity);
    }

    render(): void {
        this.textDrawer.draw(this.currentText);
        this.vertexDrawer.draw(this.moveVertex);
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
