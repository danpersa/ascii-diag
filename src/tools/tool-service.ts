import Grid from '../drawer/grid'
import {Tool, Tools} from "./tool";
import {ArrowCreateTool} from "./arrow-create-tool";
import {BoxCreateTool} from "./box-create-tool";
import {TextCreateTool} from "./text-create-tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../drawer/select-box-drawer";
import {SelectTool} from "./select-tool";
import {BoxDrawer} from "../drawer/box-drawer";
import {EntityIdService} from "../entities/entity-id-service";
import {EntitySelectionService} from "./entity-selection-service";
import {BoxEditTool} from "./box-edit-tool";
import {BoxEntity} from "../entities/box-entity";
import {TextEntity} from "../entities/text-entity";
import {TextEditTool} from "./text-edit-tool";
import {BoxResizeTool, ResizeType} from "./box-resize-tool";
import {TextDrawer} from "../drawer/text-drawer";
import {CursorDrawer} from "../drawer/cursor-drawer";
import {BoxMoveTool} from "./box-move-tool";
import {VertexDrawer} from "../drawer/vertex-drawer";
import {TextMoveTool} from "./text-move-tool";
import {ArrowDrawer} from "../drawer/arrow-drawer";
import {ArrowEditTool} from "./arrow-edit-tool";
import {ArrowEntity} from "../entities/arrow-entity";
import {ArrowFlipTool} from "./arrow-flip-tool";
import {ArrowVertexFactory} from "./arrow-vertex-factory";
import {ArrowModifyTool, ArrowModifyType} from "./arrow-modify-tool";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly arrowCreateTool: Tool;
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
    private readonly vertexDrawer: VertexDrawer;
    private readonly arrowDrawer: ArrowDrawer;
    private readonly arrowVertexFactory: ArrowVertexFactory;
    private toolStack: Array<Tool> = [];
    private toolChangeCallback: () => void = () => {
    };

    constructor(grid: Grid, layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer,
                entityIdService: EntityIdService, textDrawer: TextDrawer, cursorDrawer: CursorDrawer, vertexDrawer: VertexDrawer,
                arrowDrawer: ArrowDrawer) {
        this.layerService = layerService;
        this.cursorDrawer = cursorDrawer;
        this.textDrawer = textDrawer;
        this.arrowDrawer = arrowDrawer;
        this.boxTool = new BoxCreateTool(grid, layerService, boxDrawer, entityIdService);
        this.arrowCreateTool = new ArrowCreateTool(grid, layerService, entityIdService, arrowDrawer);
        this.textTool = new TextCreateTool(layerService, entityIdService, textDrawer, cursorDrawer);
        this.entitySelectionService = new EntitySelectionService(this.layerService, grid, entityIdService, this);
        this.arrowVertexFactory = new ArrowVertexFactory();
        this.selectTool = new SelectTool(this.entitySelectionService);
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.vertexDrawer = vertexDrawer;
        this.grid = grid;
        this.entityIdService = entityIdService;
        this.toolStack.push(this.boxTool);
    }

    setCurrentTool(tool: Tools): void {
        switch (tool) {
            case Tools.arrow:
                this.selectArrowTool();
                break;
            case Tools.box:
                this.selectBoxTool();
                break;
            case Tools.select:
                this.selectSelectTool();
                break;
            case Tools.text:
                this.selectTextTool();
                break;
        }
    }

    private popTool(): void {
        const currentTool = this.toolStack.pop();
        if (currentTool) {
            currentTool.done();
        }
    }

    currentTool(): Tool {
        return this.toolStack[this.toolStack.length - 1];
    }

    selectBoxTool(): void {
        this.setTool(this.boxTool);
    }

    selectArrowTool(): void {
        this.setTool(this.arrowCreateTool);
    }

    selectTextTool(): void {
        this.setTool(this.textTool);
    }

    selectSelectTool(): void {
        this.setTool(this.selectTool);
    }

    selectBoxResizeTool(entity: BoxEntity, resizeType: ResizeType): void {
        const boxResizeTool = new BoxResizeTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer, entity, resizeType);
        this.setTool(boxResizeTool);
    }

    selectBoxMoveTool(entity: BoxEntity): void {
        const boxMoveTool = new BoxMoveTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer, entity);
        this.setTool(boxMoveTool);
    }

    selectBoxEditTool(entity: BoxEntity): void {
        const boxEditTool = new BoxEditTool(this, this.layerService, this.entitySelectionService, this.selectBoxDrawer, entity);
        this.setTool(boxEditTool);
    }

    selectArrowEditTool(entity: ArrowEntity): void {
        const arrowEditTool = new ArrowEditTool(this, this.layerService, this.entitySelectionService, this.vertexDrawer, this.arrowVertexFactory, entity);
        this.setTool(arrowEditTool);
    }

    selectArrowFlipTool(entity: ArrowEntity): void {
        const arrowFlipTool = new ArrowFlipTool(this, this.layerService, this.vertexDrawer, this.arrowVertexFactory, entity);
        this.setTool(arrowFlipTool);
    }

    selectArrowModifyTool(entity: ArrowEntity, moveType: ArrowModifyType): void {
        const arrowModifyTool = new ArrowModifyTool(this, this.layerService, this.vertexDrawer, this.arrowVertexFactory, this.arrowDrawer, entity, moveType);
        this.setTool(arrowModifyTool);
    }

    selectTextEditTool(entity: TextEntity): void {
        const textEditTool = new TextEditTool(this.layerService, this, this.entityIdService, this.textDrawer, this.cursorDrawer,
            this.vertexDrawer, this.entitySelectionService, entity);
        this.setTool(textEditTool);
    }

    selectTextMoveTool(entity: TextEntity): void {
        const textMoveTool = new TextMoveTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer,
            this.vertexDrawer, this.textDrawer, entity);
        this.setTool(textMoveTool);
    }

    private setTool(tool: Tool): void {
        this.popTool();
        this.toolStack.push(tool);
        this.onToolChange();
    }

    setToolChangeCallback(callback: () => void) {
        this.toolChangeCallback = callback;
    }

    private onToolChange() {
        this.toolChangeCallback();
    }
}
