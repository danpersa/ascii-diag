import Grid from '../grid'
import {Tool} from "./tool";
import {ArrowTool} from "./arrow-tool";
import {BoxTool} from "./box-tool";
import {TextTool} from "./text-tool";
import {LayerService} from "../layer-service";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly arrowTool: Tool;
    private readonly textTool: Tool;
    private readonly layerService: LayerService;
    private tool: Tool;

    constructor(grid: Grid, layerService: LayerService) {
        this.layerService = layerService;
        this.boxTool = new BoxTool(grid, layerService);
        this.arrowTool = new ArrowTool(grid, layerService);
        this.textTool = new TextTool(grid, layerService);
        this.tool = this.textTool;
    }

    currentTool(): Tool {
        return this.tool;
    }

    selectBoxTool(): void {
        this.tool = this.boxTool;
    }

    selectArrowTool(): void {
        this.tool = this.arrowTool;
    }

    selectTextTool(): void {
        this.tool = this.textTool;
    }
}
