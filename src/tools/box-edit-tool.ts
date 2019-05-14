import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {BoxEntity} from "../entities/box-entity";
import {SelectBox} from "../select-box";
import {BoxResizeTool, ResizeType} from "./box-resize-tool";
import {BoxDrawer} from "../box-drawer";

export class BoxEditTool implements Tool {

    private readonly layerService: LayerService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private readonly entity: BoxEntity;
    private readonly selectBox: SelectBox;
    private childTool: Tool | null = null;

    constructor(layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entity: BoxEntity) {
        this.layerService = layerService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.entity = entity;
        this.selectBox = new SelectBox(this.entity.topRow, this.entity.leftColumn, this.entity.bottomRow, this.entity.rightColumn);
    }

    mouseDown(row: number, column: number, x: number, y: number): boolean {
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
            this.childTool = new BoxResizeTool(this.layerService, this.selectBoxDrawer, this.boxDrawer, this.entity, this.selectBox, resizeType);
            return true;
        }

        return false;
    }

    render() {
        if (this.childTool) {
            this.childTool.render();
        } else {
            this.selectBoxDrawer.draw(this.selectBox);
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean {
        //console.log("BoxEditTool drag");
        if (this.childTool) {
            //console.log("BoxEditTool: Child tool drag");
            this.childTool.drag(startRow, startColumn, row, column, x, y);
            return true;
        }
        return false;
    }

    mouseUp(row: number, column: number): boolean {
        if (this.childTool) {
            this.childTool.mouseUp(row, column);
            return true;
        }
        return false;
    }

    keyDown(key: string): boolean {
        return false;
    }

    persist(): void {
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): boolean {
        if (this.selectBox.topLeftVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'nw-resize';
        } else if (this.selectBox.topRightVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'ne-resize';
        } else if (this.selectBox.bottomLeftVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'sw-resize';
        } else if (this.selectBox.bottomRightVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'se-resize';
        }
        return true;
    }
}
