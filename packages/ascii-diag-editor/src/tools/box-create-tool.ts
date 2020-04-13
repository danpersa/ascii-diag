import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Box, BoxDrawer, BoxShape, ShapeIdService} from "ascii-diag-renderer";
import {AppState} from "../ui/app-state";

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

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        this.startRow = row;
        this.startColumn = column;
        this.box = new Box(row, column, row, column, appState.boxCornerStyle, appState.boxLineStyle);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {

        const minRow = Math.min(startRow, row);
        const maxRow = Math.max(startRow, row);
        const minColumn = Math.min(startColumn, column);
        const maxColumn = Math.max(startColumn, column);

        this.box = new Box(minRow, minColumn, maxRow, maxColumn, appState.boxCornerStyle, appState.boxLineStyle);
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        this.endRow = row;
        this.endColumn = column;
        const shape = new BoxShape(
            this.shapeIdService.nextId(),
            Math.min(this.startRow, this.endRow),
            Math.min(this.startColumn, this.endColumn),
            Math.max(this.startRow, this.endRow),
            Math.max(this.startColumn, this.endColumn),
            appState.boxCornerStyle,
            appState.boxLineStyle);
        this.layerService.createShape(shape);
        this.box = null;
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    beforeToolChange(tool: Tool): void {
    }

    render(): void {
        if (this.box) {
            this.boxDrawer.draw(this.box);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
