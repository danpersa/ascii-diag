import Grid from "../drawer/grid";
import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {ArrowDrawer} from "../drawer/arrow-drawer";
import {EntityIdService} from "../entities/entity-id-service";
import {Arrow} from "../drawer/arrow";
import {ArrowEntity} from "../entities/arrow-entity";
import Constants from "../constants";

export class ArrowCreateTool implements Tool {

    private readonly arrowDrawer: ArrowDrawer;
    private readonly grid: Grid;
    private readonly layerService: LayerService;
    private readonly entityIdService: EntityIdService;
    private startRow: number = 0;
    private startColumn: number = 0;
    private endRow: number = 0;
    private endColumn: number = 0;
    private arrow: Arrow | null = null;

    constructor(grid: Grid, layerService: LayerService, entityIdService: EntityIdService, arrowDrawer: ArrowDrawer) {
        this.grid = grid;
        this.layerService = layerService;
        this.arrowDrawer = arrowDrawer;
        this.entityIdService = entityIdService;
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
        const entity = new ArrowEntity(
            this.entityIdService.nextId(),
            this.startRow,
            this.startColumn,
            this.endRow,
            this.endColumn,
            Constants.arrowStartDirection);
        this.layerService.createEntity(entity);
    }

    render(): void {
        if (this.arrow) {
            this.arrowDrawer.draw(this.arrow);
        }
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
