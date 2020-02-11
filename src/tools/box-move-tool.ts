import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {CanvasSelectBoxDrawer, SelectBoxDrawer} from "../drawers/select-box-drawer";
import {BoxShape} from "../shapes/box-shape";
import {SelectBox} from "../drawers/select-box";
import Constants from "../constants";
import {BoxDrawer} from "../drawers/box-drawer";
import {Box} from "../drawers/box";
import {ToolService} from "./tool-service";
import {AppState} from "../ui/app-state";
import {StateProvider} from "../ui/state-provider";

export class BoxMoveTool implements Tool {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private shape: BoxShape;
    private selectBox: SelectBox;
    private box: Box | null = null;

    constructor(layerService: LayerService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, shape: BoxShape) {
        this.layerService = layerService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.shape = shape;
        this.selectBox = SelectBox.fromGrid(this.shape.topRow, this.shape.leftColumn, this.shape.bottomRow, this.shape.rightColumn);
        this.shape.startEditing();
        console.log("Create Box Move Tool shape: " + shape.topRow);
    }

    private fromCanvasToVertexPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        const [vertexRow, vertexColumn] = this.fromCanvasToVertexPos(x, y);

        const numberOfRows = this.shape.bottomRow - this.shape.topRow;
        const numberOfColumns = this.shape.rightColumn - this.shape.leftColumn;

        const newTopRow = vertexRow - Math.round(numberOfRows / 2);
        const newLeftColumn = vertexColumn - Math.round(numberOfColumns / 2);

        const newBottomRow = newTopRow + numberOfRows;
        const newRightColumn = newLeftColumn + numberOfColumns;

        if (newTopRow < 0 || newLeftColumn < 0 || newBottomRow >= Constants.numberOfRows || newRightColumn >= Constants.numberOfColumns) {
            return
        }

        this.selectBox = SelectBox.fromGrid(
            newTopRow,
            newLeftColumn,
            newBottomRow,
            newRightColumn);
        document.body.style.cursor = 'move';

        this.box = Box.Builder
            .fromSelectBox(this.selectBox)
            .build();
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        this.shape.endEditing();
        this.persist(appState);
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    persist(appState: Readonly<AppState>): void {
        const shape = new BoxShape(
            this.shape.id(),
            this.selectBox.topRow,
            this.selectBox.leftColumn,
            this.selectBox.bottomRow,
            this.selectBox.rightColumn);
        this.layerService.updateShape(shape);
        this.toolService.selectBoxEditTool(shape);
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
