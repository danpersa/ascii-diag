import Grid from '../grid'
import {Tool} from "./tool";
import {ArrowTool} from "./arrow-tool";
import {BoxTool} from "./box-tool";
import {TextCreateTool} from "./text-create-tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {SelectTool} from "./select-tool";
import {BoxDrawer} from "../box-drawer";
import {EntityIdService} from "../entities/entity-id-service";
import {EntitySelectionService} from "./entity-selection-service";
import {BoxEditTool} from "./box-edit-tool";
import {BoxEntity} from "../entities/box-entity";
import {TextEntity} from "../entities/text-entity";
import {TextEditTool} from "./text-edit-tool";
import {BoxResizeTool, ResizeType} from "./box-resize-tool";
import {TextDrawer} from "../text-drawer";
import {CursorDrawer} from "../cursor-drawer";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly arrowTool: Tool;
    private readonly textTool: Tool;
    private readonly grid: Grid;
    private readonly layerService: LayerService;
    private readonly selectTool: SelectTool;
    private readonly entitySelectionService: EntitySelectionService;
    private readonly boxDrawer: BoxDrawer;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly entityIdService: EntityIdService;
    private readonly cursorDrawer: CursorDrawer;
    private readonly textDrawer: TextDrawer;
    private toolStack: Array<Tool> = [];

    constructor(grid: Grid, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, entityIdService: EntityIdService, textDrawer: TextDrawer, cursorDrawer: CursorDrawer) {
        this.layerService = layerService;
        this.cursorDrawer = cursorDrawer;
        this.textDrawer = textDrawer;
        this.boxTool = new BoxTool(grid, layerService, boxDrawer, entityIdService);
        this.arrowTool = new ArrowTool(grid, layerService);
        this.textTool = new TextCreateTool(layerService, entityIdService, textDrawer, cursorDrawer);
        this.entitySelectionService = new EntitySelectionService(this.layerService, grid, entityIdService, this);
        this.selectTool = new SelectTool(this.entitySelectionService);
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.grid = grid;
        this.entityIdService = entityIdService;
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

    selectBoxResizeTool(entity: BoxEntity, resizeType: ResizeType): void {
        const boxResizeTool = new BoxResizeTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer, entity, resizeType);
        this.setTool(boxResizeTool);
    }

    selectBoxEditTool(entity: BoxEntity): void {
        const boxEditTool = new BoxEditTool(this, this.entitySelectionService, this.selectBoxDrawer, entity);
        this.setTool(boxEditTool);
    }

    selectTextEditTool(entity: TextEntity): void {
        const textEditTool = new TextEditTool(this.layerService, this.entityIdService, this.textDrawer, this.cursorDrawer, this.entitySelectionService, entity);
        this.setTool(textEditTool);
    }

    setTool(tool: Tool): void {
        this.toolStack.pop();
        this.toolStack.push(tool);
    }

    popTool(): void {
        this.toolStack.pop();
    }
}
