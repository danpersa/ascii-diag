import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {ArrowDrawer} from "../drawers/arrow-drawer";
import {ShapeIdService} from "../shapes/shape-id-service";
import {Arrow} from "../drawers/arrow";
import {ArrowShape} from "../shapes/arrow-shape";
import Constants from "../constants";

export class ArrowCreateTool implements Tool {

    private readonly arrowDrawer: ArrowDrawer;
    private readonly layerService: LayerService;
    private readonly shapeIdService: ShapeIdService;
    private startRow: number = 0;
    private startColumn: number = 0;
    private endRow: number = 0;
    private endColumn: number = 0;
    private arrow: Arrow | null = null;

    constructor(layerService: LayerService, shapeIdService: ShapeIdService, arrowDrawer: ArrowDrawer) {
        this.layerService = layerService;
        this.arrowDrawer = arrowDrawer;
        this.shapeIdService = shapeIdService;
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        this.startRow = row;
        this.startColumn = column;
        this.arrow = new Arrow(row, column, row, column, Constants.arrowStartDirection);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        this.arrow = new Arrow(startRow, startColumn, row, column, Constants.arrowStartDirection);
    }

    mouseUp(row: number, column: number): void {
        this.endRow = row;
        this.endColumn = column;
        this.persist();
        this.arrow = null;
    }

    keyDown(key: string): void {
    }

    persist(): void {
        const shape = new ArrowShape(
            this.shapeIdService.nextId(),
            this.startRow,
            this.startColumn,
            this.endRow,
            this.endColumn,
            Constants.arrowStartDirection);
        this.layerService.createShape(shape);
    }

    render(): void {
        if (this.arrow) {
            this.arrowDrawer.draw(this.arrow);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
