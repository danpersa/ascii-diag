import {TextEntity} from "../entities/text-entity";
import {BoxEntity} from "../entities/box-entity";
import {LayerService} from "../layer-service";
import Grid from "../grid";
import {EntityIdService} from "../entities/entity-id-service";
import {ToolService} from "./tool-service";

export class EntitySelectionService {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;

    constructor(layerService: LayerService, grid: Grid, entityIdService: EntityIdService, toolService: ToolService) {
        this.layerService = layerService;
        this.toolService = toolService;
    }

    selectEntityFor(row: number, column: number) {
        const entity = this.layerService.getEntity(row, column);

        if (entity && entity instanceof TextEntity) {
            console.log("Selected text");
            this.toolService.selectTextEditTool(entity);
        } else if (entity && entity instanceof BoxEntity) {
            this.toolService.selectBoxEditTool(entity);
        } else {
            this.toolService.selectSelectTool();
        }
    }
}
