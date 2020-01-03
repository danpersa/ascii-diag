import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../drawer/select-box-drawer";
import {BoxEntity} from "../entities/box-entity";
import {SelectBox} from "../drawer/select-box";
import Constants from "../constants";
import {BoxDrawer} from "../drawer/box-drawer";
import {Box} from "../drawer/box";
import {ToolService} from "./tool-service";

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
        this.selectBox = SelectBox.fromGrid(this.entity.topRow, this.entity.leftColumn, this.entity.bottomRow, this.entity.rightColumn);
        this.entity.startEditing();
        console.log("Create Box Resize Tool resizeType=" + resizeType + " entity: " + entity.topRow);
    }

    private fromCanvasToVertexPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        const [vertexRow, vertexColumn] = this.fromCanvasToVertexPos(x, y);

        switch (this.resizeType) {
            case ResizeType.TopLeft: {
                this.selectBox = SelectBox.fromGrid(
                    Math.min(vertexRow, this.selectBox.bottomRow),
                    Math.min(vertexColumn, this.selectBox.rightColumn),
                    this.selectBox.bottomRow,
                    this.selectBox.rightColumn);
                document.body.style.cursor = 'nw-resize';
                break;
            }
            case ResizeType.TopRight: {
                this.selectBox = SelectBox.fromGrid(
                    Math.min(vertexRow, this.selectBox.bottomRow),
                    this.selectBox.leftColumn,
                    this.selectBox.bottomRow,
                    Math.max(vertexColumn, this.selectBox.leftColumn));
                document.body.style.cursor = 'ne-resize';
                break;
            }
            case ResizeType.BottomLeft: {
                this.selectBox = SelectBox.fromGrid(
                    this.selectBox.topRow,
                    Math.min(vertexColumn, this.selectBox.rightColumn),
                    Math.max(vertexRow, this.selectBox.topRow),
                    this.selectBox.rightColumn);
                document.body.style.cursor = 'sw-resize';
                break;
            }
            case ResizeType.BottomRight: {
                this.selectBox = SelectBox.fromGrid(
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
    }

    mouseUp(row: number, column: number): void {
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
    }

    keyDown(key: string): void {
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
    }

    persist(): void {
    }

    render(): void {
        if (this.box) {
            this.boxDrawer.draw(this.box);
        }
        this.selectBoxDrawer.draw(this.selectBox);
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
