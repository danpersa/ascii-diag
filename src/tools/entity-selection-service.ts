import {TextShape} from "../shapes/text-shape";
import {BoxShape} from "../shapes/box-shape";
import {LayerService} from "../layer-service";
import {ShapeIdService} from "../shapes/shape-id-service";
import {ToolService} from "./tool-service";
import {ArrowShape} from "../shapes/arrow-shape";

export class EntitySelectionService {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;

    constructor(layerService: LayerService, entityIdService: ShapeIdService, toolService: ToolService) {
        this.layerService = layerService;
        this.toolService = toolService;
    }

    selectEntityFor(row: number, column: number) {
        const entity = this.layerService.getEntity(row, column);

        if (entity && entity instanceof TextShape) {
            this.toolService.selectTextEditTool(entity);
        } else if (entity && entity instanceof BoxShape) {
            this.toolService.selectBoxEditTool(entity);
        } else if (entity && entity instanceof ArrowShape) {
            this.toolService.selectArrowEditTool(entity);
        } else {
            this.toolService.selectSelectTool();
        }
    }
}
