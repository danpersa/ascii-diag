import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../drawers/select-box-drawer";
import Constants from "../constants";
import {BoxDrawer} from "../drawers/box-drawer";
import {ToolService} from "./tool-service";
import {TextShape} from "../shapes/text-shape";
import {Vertex} from "../drawers/vertex";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {Text} from "../drawers/text";
import {TextDrawer} from "../drawers/text-drawer";

export class TextMoveTool implements Tool {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private readonly vertexDrawer: VertexDrawer;
    private readonly textDrawer: TextDrawer;

    private readonly currentEntity: TextShape;
    protected currentText: Text;
    private moveVertex: Vertex;

    constructor(layerService: LayerService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer,
                boxDrawer: BoxDrawer, vertexDrawer: VertexDrawer, textDrawer: TextDrawer, entity: TextShape) {

        this.layerService = layerService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.vertexDrawer = vertexDrawer;
        this.textDrawer = textDrawer;

        this.currentEntity = entity;
        this.currentText = Text.fromGrid(this.currentEntity.row, this.currentEntity.column, this.currentEntity.text);
        this.moveVertex = Vertex.fromGrid(this.currentEntity.row, this.currentEntity.column);
        console.log("Start moving text");
        this.currentEntity.startEditing();
    }

    private fromCanvasToGridPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        const [vertexRow, vertexColumn] = this.fromCanvasToGridPos(x, y);
        this.moveVertex = Vertex.fromGrid(vertexRow, vertexColumn);
        this.currentText = Text.fromGrid(vertexRow, vertexColumn, this.currentEntity.text);
        document.body.style.cursor = 'move';
    }

    mouseUp(row: number, column: number): void {
        console.log("End moving text");
        this.currentEntity.endEditing();
        this.persist();
    }

    keyDown(key: string): void {
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
    }

    persist(): void {
        const entity = new TextShape(
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
