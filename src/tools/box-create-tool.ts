import {Tool} from "./tool";
import Grid from "../grid";
import {LayerService} from "../layer-service";
import {BoxEntity} from "../entities/box-entity";
import {BoxDrawer} from "../box-drawer";
import {Box} from "../box";
import {EntityIdService} from "../entities/entity-id-service";

export class BoxCreateTool implements Tool {

    private readonly grid: Grid;
    private readonly layerService: LayerService;
    private readonly boxDrawer: BoxDrawer;
    private readonly entityIdService: EntityIdService;
    private startRow: number = 0;
    private startColumn: number = 0;
    private endRow: number = 0;
    private endColumn: number = 0;
    private box: Box | null = null;

    constructor(grid: Grid, layerService: LayerService, boxDrawer: BoxDrawer, entityIdService: EntityIdService) {
        this.grid = grid;
        this.layerService = layerService;
        this.boxDrawer = boxDrawer;
        this.entityIdService = entityIdService;
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
        const entity = new BoxEntity(
            this.entityIdService.nextId(),
            Math.min(this.startRow, this.endRow),
            Math.min(this.startColumn, this.endColumn),
            Math.max(this.startRow, this.endRow),
            Math.max(this.startColumn, this.endColumn));
        this.layerService.createEntity(entity);
    }

    render(): void {
        if (this.box) {
            this.boxDrawer.draw(this.box);
        }
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
