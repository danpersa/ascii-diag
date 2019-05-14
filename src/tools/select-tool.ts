import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {TextEntity} from "../entities/text-entity";
import {BoxEntity} from "../entities/box-entity";
import Grid from "../grid";
import {TextEditTool} from "./text-edit-tool";
import {BoxEditTool} from "./box-edit-tool";
import {BoxDrawer} from "../box-drawer";
import {EntityIdService} from "../entities/entity-id-service";

export class SelectTool implements Tool {

    private readonly layerService: LayerService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;
    private readonly entityIdService: EntityIdService;
    private readonly grid: Grid;
    private childTool: Tool | null = null;

    constructor(grid: Grid, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entityIdService: EntityIdService) {
        this.layerService = layerService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.grid = grid;
        this.entityIdService = entityIdService;
    }

    mouseDown(row: number, column: number, x: number, y: number): boolean {
        console.log("Select tool click on row: " + row + " column=" + column);

        let eventHandled = false;
        if (this.childTool) {
            eventHandled = this.childTool.mouseDown(row, column, x, y);

            if (eventHandled) {
                return true;
            } else {
                this.childTool.persist();
                this.childTool.done();
                this.childTool = null;
            }
        }

        const entity = this.layerService.getEntity(row, column);

        if (entity && entity instanceof TextEntity) {
            console.log("Selected text");
            const textTool = new TextEditTool(
                this.grid,
                this.layerService,
                this.entityIdService,
                entity);
            this.childTool = textTool;
        } else if (entity && entity instanceof BoxEntity) {
            const boxEditTool = new BoxEditTool(this.layerService, this.selectBoxDrawer, this.boxDrawer, entity);
            this.childTool = boxEditTool;
        } else {
        }
        return true;
    }

    render() {
        if (this.childTool) {
            this.childTool.render();
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean {
        //console.log("Select tool drag");
        if (this.childTool) {
            this.childTool.drag(startRow, startColumn, row, column, x, y);
        }
        return true;
    }

    mouseUp(row: number, column: number): boolean {
        if (this.childTool) {
            this.childTool.mouseUp(row, column);
            return true;
        }
        return false;
    }

    keyDown(key: string): boolean {
        if (this.childTool) {
            this.childTool.keyDown(key);
        }
        return true;
    }

    persist(): void {
        if (this.childTool) {
            this.childTool.persist();
        }
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): boolean {
        if (this.childTool) {
            this.childTool.mouseMove(row, column, x, y);
        }
        return true;
    }
}
