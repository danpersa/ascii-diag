import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {BoxShape} from "../shapes/box-shape";
import {BoxDrawer} from "../drawers/box-drawer";
import {Box} from "../drawers/box";
import {ShapeIdService} from "../shapes/shape-id-service";

export class BoxCreateTool implements Tool {

    private readonly layerService: LayerService;
    private readonly boxDrawer: BoxDrawer;
    private readonly shapeIdService: ShapeIdService;
    private startRow: number = 0;
    private startColumn: number = 0;
    private endRow: number = 0;
    private endColumn: number = 0;
    private box: Box | null = null;

    constructor(layerService: LayerService, boxDrawer: BoxDrawer, shapeIdService: ShapeIdService) {
        this.layerService = layerService;
        this.boxDrawer = boxDrawer;
        this.shapeIdService = shapeIdService;
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        this.startRow = row;
        this.startColumn = column;
        this.box = new Box(row, column, row, column);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {

        const minRow = Math.min(startRow, row);
        const maxRow = Math.max(startRow, row);
        const minColumn = Math.min(startColumn, column);
        const maxColumn = Math.max(startColumn, column);

        this.box = new Box(minRow, minColumn, maxRow, maxColumn);
    }

    mouseUp(row: number, column: number): void {
        this.endRow = row;
        this.endColumn = column;
        this.persist();
        this.box = null;
    }

    keyDown(key: string): void {
    }

    persist(): void {
        const shape = new BoxShape(
            this.shapeIdService.nextId(),
            Math.min(this.startRow, this.endRow),
            Math.min(this.startColumn, this.endColumn),
            Math.max(this.startRow, this.endRow),
            Math.max(this.startColumn, this.endColumn));
        this.layerService.createShape(shape);
    }

    render(): void {
        if (this.box) {
            this.boxDrawer.draw(this.box);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
