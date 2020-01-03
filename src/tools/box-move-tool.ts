import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {CanvasSelectBoxDrawer, SelectBoxDrawer} from "../drawer/select-box-drawer";
import {BoxEntity} from "../entities/box-entity";
import {SelectBox} from "../drawer/select-box";
import Constants from "../constants";
import {BoxDrawer} from "../drawer/box-drawer";
import {Box} from "../drawer/box";
import {ToolService} from "./tool-service";

export class BoxMoveTool implements Tool {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private entity: BoxEntity;
    private selectBox: SelectBox;
    private box: Box | null = null;

    constructor(layerService: LayerService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entity: BoxEntity) {
        this.layerService = layerService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.entity = entity;
        this.selectBox = SelectBox.fromGrid(this.entity.topRow, this.entity.leftColumn, this.entity.bottomRow, this.entity.rightColumn);
        this.entity.startEditing();
        console.log("Create Box Move Tool entity: " + entity.topRow);
    }

    private fromCanvasToVertexPos(x: number, y: number): [number, number] {
        return [Math.round(y / Constants.densityY), Math.round(x / Constants.densityX)];
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        const [vertexRow, vertexColumn] = this.fromCanvasToVertexPos(x, y);

        const numberOfRows = this.entity.bottomRow - this.entity.topRow;
        const numberOfColumns = this.entity.rightColumn - this.entity.leftColumn;

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

        this.box = new Box(
            this.selectBox.topRow,
            this.selectBox.leftColumn,
            this.selectBox.bottomRow,
            this.selectBox.rightColumn);
    }

    mouseUp(row: number, column: number): void {
        this.entity.endEditing();
        this.persist();
    }

    keyDown(key: string): void {
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
    }

    persist(): void {
        const entity = new BoxEntity(
            this.entity.id(),
            this.selectBox.topRow,
            this.selectBox.leftColumn,
            this.selectBox.bottomRow,
            this.selectBox.rightColumn);
        this.layerService.updateEntity(entity);
        this.toolService.selectBoxEditTool(entity);
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
