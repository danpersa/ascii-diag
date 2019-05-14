import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {BoxEntity} from "../entities/box-entity";
import {SelectBox} from "../select-box";
import Constants from "../constants";
import {BoxDrawer} from "../box-drawer";
import {Box} from "../box";
import {ToolService} from "./tool-service";
import {BoxEditTool} from "./box-edit-tool";
import {EntitySelectionService} from "./entity-selection-service";

export enum ResizeType {
    TopLeft,
    TopRight,
    BottomLeft,
    BottomRight
}

export class BoxResizeTool implements Tool {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private entity: BoxEntity;
    private selectBox: SelectBox;
    private box: Box | null = null;
    private readonly resizeType: ResizeType;

    constructor(layerService: LayerService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entity: BoxEntity,
                resizeType: ResizeType) {
        this.layerService = layerService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.resizeType = resizeType;
        this.entity = entity;
        this.selectBox = new SelectBox(this.entity.topRow, this.entity.leftColumn, this.entity.bottomRow, this.entity.rightColumn);
        this.entity.startEditing();
        console.log("Create Box Resize Tool resizeType=" + resizeType + " entity: " + entity.topRow);
    }

    private fromCanvasToVertexPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean {
        //console.log("Resize Box Tool drag x=" + x + " y=" + y);
        const [vertexRow, vertexColumn] = this.fromCanvasToVertexPos(x, y);
        //console.log("Vertex row=" + vertexRow + " column=" + vertexColumn + " Resize Type=" + this.resizeType);

        switch (this.resizeType) {
            case ResizeType.TopLeft: {
                this.selectBox = new SelectBox(
                    Math.min(vertexRow, this.selectBox.bottomRow),
                    Math.min(vertexColumn, this.selectBox.rightColumn),
                    this.selectBox.bottomRow,
                    this.selectBox.rightColumn);
                document.body.style.cursor = 'nw-resize';
                break;
            }
            case ResizeType.TopRight: {
                this.selectBox = new SelectBox(
                    Math.min(vertexRow, this.selectBox.bottomRow),
                    this.selectBox.leftColumn,
                    this.selectBox.bottomRow,
                    Math.max(vertexColumn, this.selectBox.leftColumn));
                document.body.style.cursor = 'ne-resize';
                break;
            }
            case ResizeType.BottomLeft: {
                this.selectBox = new SelectBox(
                    this.selectBox.topRow,
                    Math.min(vertexColumn, this.selectBox.rightColumn),
                    Math.max(vertexRow, this.selectBox.topRow),
                    this.selectBox.rightColumn);
                document.body.style.cursor = 'sw-resize';
                break;
            }
            case ResizeType.BottomRight: {
                this.selectBox = new SelectBox(
                    this.selectBox.topRow,
                    this.selectBox.leftColumn,
                    Math.max(vertexRow, this.selectBox.topRow),
                    Math.max(vertexColumn, this.selectBox.leftColumn));
                document.body.style.cursor = 'se-resize';
                break;
            }
        }
        this.box = new Box(
            this.selectBox.topRow,
            this.selectBox.leftColumn,
            this.selectBox.bottomRow,
            this.selectBox.rightColumn);
        return true;
    }

    mouseUp(row: number, column: number): boolean {
        this.entity.endEditing();

        const entity = new BoxEntity(
            this.entity.id(),
            this.selectBox.topRow,
            this.selectBox.leftColumn,
            this.selectBox.bottomRow,
            this.selectBox.rightColumn);
        console.log("save entity id=" + entity.id(), " row=" + entity.topRow);
        this.layerService.updateEntity(entity);
        this.toolService.selectBoxEditTool(entity);

        return true;
    }

    keyDown(key: string): boolean {
        return false;
    }

    mouseDown(row: number, column: number, x: number, y: number): boolean {
        return true;
    }

    persist(): void {
    }

    render(): void {
        //console.log("BoxResizeTool Render");
        if (this.box) {
            //console.log("draw box");
            this.boxDrawer.draw(this.box);
        }
        this.selectBoxDrawer.draw(this.selectBox);
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): boolean {
        return false;
    }
}
