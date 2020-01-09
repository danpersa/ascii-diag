import {TextEntity} from "../entities/text-entity";
import {BoxEntity} from "../entities/box-entity";
import {LayerService} from "../layer-service";
import {EntityIdService} from "../entities/entity-id-service";
import {ToolService} from "./tool-service";
import {ArrowEntity} from "../entities/arrow-entity";

export class EntitySelectionService {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;

    constructor(layerService: LayerService, entityIdService: EntityIdService, toolService: ToolService) {
        this.layerService = layerService;
        this.toolService = toolService;
    }

    selectEntityFor(row: number, column: number) {
        const entity = this.layerService.getEntity(row, column);

        if (entity && entity instanceof TextEntity) {
            this.toolService.selectTextEditTool(entity);
        } else if (entity && entity instanceof BoxEntity) {
            this.toolService.selectBoxEditTool(entity);
        } else if (entity && entity instanceof ArrowEntity) {
            this.toolService.selectArrowEditTool(entity);
        } else {
            this.toolService.selectSelectTool();
        }
    }
}
