import Grid from '../grid'
import {Tool} from "./tool";
import {ArrowTool} from "./arrow-tool";
import {BoxTool} from "./box-tool";
import {TextTool} from "./text-tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {SelectTool} from "./select-tool";
import {BoxDrawer} from "../box-drawer";
import {EntityIdService} from "../entities/entity-id-service";
import {EntitySelectionService} from "./entity-selection-service";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly arrowTool: Tool;
    private readonly textTool: Tool;
    private readonly layerService: LayerService;
    private readonly selectTool: SelectTool;
    private toolStack: Array<Tool> = [];

    constructor(grid: Grid, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entityIdService: EntityIdService) {
        this.layerService = layerService;
        this.boxTool = new BoxTool(grid, layerService, boxDrawer, entityIdService);
        this.arrowTool = new ArrowTool(grid, layerService);
        this.textTool = new TextTool(grid, layerService, entityIdService);
        const entitySelectionService = new EntitySelectionService(this.layerService, grid, entityIdService, this, selectBoxDrawer, boxDrawer);
        this.selectTool = new SelectTool(grid, layerService, selectBoxDrawer, boxDrawer, entityIdService, this, entitySelectionService);
        this.toolStack.push(this.boxTool);
    }

    currentTool(): Tool {
        return this.toolStack[this.toolStack.length - 1];
    }

    selectBoxTool(): void {
        this.toolStack.pop();
        this.toolStack.push(this.boxTool);
    }

    selectArrowTool(): void {
        this.toolStack.pop();
        this.toolStack.push(this.arrowTool);
    }

    selectTextTool(): void {
        this.toolStack.pop();
        this.toolStack.push(this.textTool);
    }

    selectSelectTool(): void {
        console.log("Select tool active");
        this.toolStack.pop();
        this.toolStack.push(this.selectTool);
    }

    setTool(tool: Tool): void {
        this.toolStack.pop();
        this.toolStack.push(tool);
    }

    popTool(): void {
        this.toolStack.pop();
    }
}
