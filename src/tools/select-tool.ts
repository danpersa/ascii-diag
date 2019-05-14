import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import Grid from "../grid";
import {BoxDrawer} from "../box-drawer";
import {EntityIdService} from "../entities/entity-id-service";
import {ToolService} from "./tool-service";
import {EntitySelectionService} from "./entity-selection-service";

export class SelectTool implements Tool {

    private readonly layerService: LayerService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private readonly entityIdService: EntityIdService;
    private readonly grid: Grid;
    private readonly toolService: ToolService;
    private readonly entitySelectionService: EntitySelectionService;

    constructor(grid: Grid, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entityIdService: EntityIdService, toolService: ToolService, entitySelectionService: EntitySelectionService) {
        this.layerService = layerService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.grid = grid;
        this.entityIdService = entityIdService;
        this.toolService = toolService;
        this.entitySelectionService = entitySelectionService;
    }

    mouseDown(row: number, column: number, x: number, y: number): boolean {
        console.log("Select tool click on row: " + row + " column=" + column);
        this.entitySelectionService.selectEntityFor(row, column);
        return true;
    }

    render() {
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean {
        return true;
    }

    mouseUp(row: number, column: number): boolean {
        return false;
    }

    keyDown(key: string): boolean {
        return true;
    }

    persist(): void {
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): boolean {
        return true;
    }
}
