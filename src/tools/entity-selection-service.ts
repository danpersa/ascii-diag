import {TextEntity} from "../entities/text-entity";
import {TextEditTool} from "./text-edit-tool";
import {BoxEntity} from "../entities/box-entity";
import {BoxEditTool} from "./box-edit-tool";
import {LayerService} from "../layer-service";
import Grid from "../grid";
import {EntityIdService} from "../entities/entity-id-service";
import {ToolService} from "./tool-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {BoxDrawer} from "../box-drawer";
import {SelectTool} from "./select-tool";
import grid from "../grid";

export class EntitySelectionService {

    private readonly layerService: LayerService;
    private readonly grid: Grid;
    private readonly entityIdService: EntityIdService;
    private readonly toolService: ToolService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly boxDrawer: BoxDrawer;

    constructor(layerService: LayerService, grid: Grid, entityIdService: EntityIdService, toolService: ToolService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer) {
        this.layerService = layerService;
        this.grid = grid;
        this.entityIdService = entityIdService;
        this.toolService = toolService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
    }

    selectEntityFor(row: number, column: number) {
        const entity = this.layerService.getEntity(row, column);

        if (entity && entity instanceof TextEntity) {
            console.log("Selected text");
            const textEditTool = new TextEditTool(
                this.grid,
                this.layerService,
                this.entityIdService,
                entity);
            this.toolService.setTool(textEditTool);
        } else if (entity && entity instanceof BoxEntity) {
            const boxEditTool = new BoxEditTool(this.layerService, this.toolService, this, this.selectBoxDrawer, this.boxDrawer, entity);
            this.toolService.setTool(boxEditTool);
        } else {
            const selectTool = new SelectTool(this.grid, this.layerService, this.selectBoxDrawer, this.boxDrawer, this.entityIdService, this.toolService, this);
            this.toolService.setTool(selectTool);
        }
    }
}
