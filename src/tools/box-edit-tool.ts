import {Tool} from "./tool";
import {SelectBoxDrawer} from "../drawers/select-box-drawer";
import {BoxShape} from "../shapes/box-shape";
import {SelectBox} from "../drawers/select-box";
import {ResizeType} from "./box-resize-tool";
import {ToolService} from "./tool-service";
import {LayerService} from "../layer-service";
import {AppState} from "../ui/app-state";

export class BoxEditTool implements Tool {

    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;

    private readonly shape: BoxShape;
    private readonly selectBox: SelectBox;


    constructor(toolService: ToolService, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, shape: BoxShape) {
        this.toolService = toolService;
        this.layerService = layerService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.shape = shape;
        this.selectBox = SelectBox.fromGrid(this.shape.topRow, this.shape.leftColumn, this.shape.bottomRow, this.shape.rightColumn);
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        console.log("Box Edit Tool click on row: " + row + " column=" + column);

        let resizeType: ResizeType | null = null;

        if (this.selectBox.topLeftVertex.containsPoint(x, y)) {
            resizeType = ResizeType.TopLeft;
        } else if (this.selectBox.topRightVertex.containsPoint(x, y)) {
            resizeType = ResizeType.TopRight;
        } else if (this.selectBox.bottomLeftVertex.containsPoint(x, y)) {
            resizeType = ResizeType.BottomLeft;
        } else if (this.selectBox.bottomRightVertex.containsPoint(x, y)) {
            resizeType = ResizeType.BottomRight;
        }

        if (resizeType != null) {
            this.toolService.selectBoxResizeTool(this.shape, resizeType);
        } else if (this.selectBox.centerVertex.containsPoint(x, y)) {
            this.toolService.selectBoxMoveTool(this.shape);
        } else {
            this.toolService.selectShapeFor(row, column);
        }
    }

    render() {
        this.selectBoxDrawer.draw(this.selectBox);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
        if (key === "Backspace" || key === "Delete") {
            this.layerService.deleteShape(this.shape.id());
            this.toolService.selectSelectTool();
        }
    }

    beforeToolChange(tool: Tool): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        if (this.selectBox.topLeftVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'nw-resize';
        } else if (this.selectBox.topRightVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'ne-resize';
        } else if (this.selectBox.bottomLeftVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'sw-resize';
        } else if (this.selectBox.bottomRightVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'se-resize';
        } else if (this.selectBox.centerVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
