import {TextShape} from "../shapes/text-shape";
import {BoxShape} from "../shapes/box-shape";
import {LayerService} from "../layer-service";
import {ShapeIdService} from "../shapes/shape-id-service";
import {ToolService} from "./tool-service";
import {ArrowShape} from "../shapes/arrow-shape";

export class ShapeSelectionService {

    private readonly layerService: LayerService;
    private readonly toolService: ToolService;

    constructor(layerService: LayerService, shapeIdService: ShapeIdService, toolService: ToolService) {
        this.layerService = layerService;
        this.toolService = toolService;
    }

    selectShapeFor(row: number, column: number) {
        const shape = this.layerService.getShape(row, column);

        if (shape && shape instanceof TextShape) {
            this.toolService.selectTextEditTool(shape);
        } else if (shape && shape instanceof BoxShape) {
            this.toolService.selectBoxEditTool(shape);
        } else if (shape && shape instanceof ArrowShape) {
            this.toolService.selectArrowEditTool(shape);
        } else {
            this.toolService.selectSelectTool();
        }
    }
}
