import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../drawers/select-box-drawer";
import {BoxShape} from "../shapes/box-shape";
import {SelectBox} from "../drawers/select-box";
import Constants from "../constants";
import {BoxDrawer} from "../drawers/box-drawer";
import {Box} from "../drawers/box";
import {ToolService} from "./tool-service";
import {AppState} from "../ui/app-state";
import {StateProvider} from "../ui/state-provider";

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
    private shape: BoxShape;
    private selectBox: SelectBox;
    private box: Box | null = null;
    private readonly resizeType: ResizeType;

    constructor(layerService: LayerService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, shape: BoxShape,
                resizeType: ResizeType) {
        this.layerService = layerService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.resizeType = resizeType;
        this.shape = shape;
        this.selectBox = SelectBox.fromGrid(this.shape.topRow, this.shape.leftColumn, this.shape.bottomRow, this.shape.rightColumn);
        this.shape.startEditing();
        console.log("Create Box Resize Tool resizeType=" + resizeType + " shape: " + shape.topRow);
    }

    private fromCanvasToVertexPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
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
        this.box = Box.Builder
            .fromSelectBox(this.selectBox)
            .build();
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        this.shape.endEditing();

        const shape = new BoxShape(
            this.shape.id(),
            this.selectBox.topRow,
            this.selectBox.leftColumn,
            this.selectBox.bottomRow,
            this.selectBox.rightColumn);
        console.log("save shape id=" + shape.id(), " row=" + shape.topRow);
        this.layerService.updateShape(shape);
        this.toolService.selectBoxEditTool(shape);
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    persist(appState: Readonly<AppState>): void {
    }

    render(): void {
        if (this.box) {
            this.boxDrawer.draw(this.box);
        }
        this.selectBoxDrawer.draw(this.selectBox);
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
