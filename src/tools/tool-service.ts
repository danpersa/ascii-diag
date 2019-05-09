import Grid from '../grid'
import {Tool} from "./tool";
import {ArrowTool} from "./arrow-tool";
import {BoxTool} from "./box-tool";
import {TextTool} from "./text-tool";
import {LayerService} from "../layer-service";
import {BoxEditTool} from "./box-edit-tool";
import {SelectBoxDrawer} from "../select-box-drawer";
import {EditorService} from "../editors/editor-service";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly boxEditTool: Tool;
    private readonly arrowTool: Tool;
    private readonly textTool: Tool;
    private readonly layerService: LayerService;
    private tool: Tool;

    constructor(grid: Grid, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, editorService: EditorService) {
        this.layerService = layerService;
        this.boxTool = new BoxTool(grid, layerService);
        this.boxEditTool = new BoxEditTool(layerService, selectBoxDrawer, editorService);
        this.arrowTool = new ArrowTool(grid, layerService);
        this.textTool = new TextTool(grid, layerService);
        this.tool = this.boxTool;
    }

    currentTool(): Tool {
        return this.tool;
    }

    selectBoxTool(): void {
        this.tool = this.boxTool;
    }

    selectBoxEditTool(): void {
        this.tool = this.boxEditTool;
    }

    selectArrowTool(): void {
        this.tool = this.arrowTool;
    }

    selectTextTool(): void {
        this.tool = this.textTool;
    }
}
