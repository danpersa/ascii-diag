import {Tool} from "./tool";
import {SelectBoxDrawer} from "../drawers/select-box-drawer";
import {BoxShape} from "../shapes/box-shape";
import {SelectBox} from "../drawers/select-box";
import {ResizeType} from "./box-resize-tool";
import {ToolService} from "./tool-service";
import {ShapeSelectionService} from "./shape-selection-service";
import {LayerService} from "../layer-service";

export class BoxEditTool implements Tool {

    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly toolService: ToolService;
    private readonly shapeSelectionService: ShapeSelectionService;
    private readonly layerService: LayerService;

    private readonly shape: BoxShape;
    private readonly selectBox: SelectBox;


    constructor(toolService: ToolService, layerService: LayerService, shapeSelectionService: ShapeSelectionService, selectBoxDrawer: SelectBoxDrawer, shape: BoxShape) {
        this.toolService = toolService;
        this.layerService = layerService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.shape = shape;
        this.shapeSelectionService = shapeSelectionService;
        this.selectBox = SelectBox.fromGrid(this.shape.topRow, this.shape.leftColumn, this.shape.bottomRow, this.shape.rightColumn);
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
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
            this.shapeSelectionService.selectShapeFor(row, column);
        }
    }

    render() {
        this.selectBoxDrawer.draw(this.selectBox);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
    }

    mouseUp(row: number, column: number): void {
    }

    keyDown(key: string): void {
        if (key === "Backspace" || key === "Delete") {
            this.layerService.deleteShape(this.shape.id());
            this.toolService.selectSelectTool();
        }
    }

    persist(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
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
