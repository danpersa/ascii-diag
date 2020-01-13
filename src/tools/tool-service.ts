import {Tool, Tools} from "./tool";
import {ArrowCreateTool} from "./arrow-create-tool";
import {BoxCreateTool} from "./box-create-tool";
import {TextCreateTool} from "./text-create-tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../drawers/select-box-drawer";
import {SelectTool} from "./select-tool";
import {BoxDrawer} from "../drawers/box-drawer";
import {ShapeIdService} from "../shapes/shape-id-service";
import {ShapeSelectionService} from "./shape-selection-service";
import {BoxEditTool} from "./box-edit-tool";
import {BoxShape} from "../shapes/box-shape";
import {TextShape} from "../shapes/text-shape";
import {TextEditTool} from "./text-edit-tool";
import {BoxResizeTool, ResizeType} from "./box-resize-tool";
import {TextDrawer} from "../drawers/text-drawer";
import {CursorDrawer} from "../drawers/cursor-drawer";
import {BoxMoveTool} from "./box-move-tool";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {TextMoveTool} from "./text-move-tool";
import {ArrowDrawer} from "../drawers/arrow-drawer";
import {ArrowEditTool} from "./arrow-edit-tool";
import {ArrowShape} from "../shapes/arrow-shape";
import {ArrowFlipTool} from "./arrow-flip-tool";
import {ArrowVertexFactory} from "./arrow-vertex-factory";
import {ArrowModifyTool, ArrowModifyType} from "./arrow-modify-tool";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly arrowCreateTool: Tool;
    private readonly textTool: Tool;
    private readonly layerService: LayerService;
    private readonly selectTool: SelectTool;
    private readonly shapeSelectionService: ShapeSelectionService;
    private readonly boxDrawer: BoxDrawer;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly shapeIdService: ShapeIdService;
    private readonly cursorDrawer: CursorDrawer;
    private readonly textDrawer: TextDrawer;
    private readonly vertexDrawer: VertexDrawer;
    private readonly arrowDrawer: ArrowDrawer;
    private readonly arrowVertexFactory: ArrowVertexFactory;
    private toolStack: Array<Tool> = [];
    private toolChangeCallback: () => void = () => {
    };

    constructor(layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, shapeIdService: ShapeIdService,
                textDrawer: TextDrawer, cursorDrawer: CursorDrawer, vertexDrawer: VertexDrawer, arrowDrawer: ArrowDrawer) {
        this.layerService = layerService;
        this.cursorDrawer = cursorDrawer;
        this.textDrawer = textDrawer;
        this.arrowDrawer = arrowDrawer;
        this.boxTool = new BoxCreateTool(layerService, boxDrawer, shapeIdService);
        this.arrowCreateTool = new ArrowCreateTool(layerService, shapeIdService, arrowDrawer);
        this.textTool = new TextCreateTool(layerService, shapeIdService, textDrawer, cursorDrawer);
        this.shapeSelectionService = new ShapeSelectionService(this.layerService, shapeIdService, this);
        this.arrowVertexFactory = new ArrowVertexFactory();
        this.selectTool = new SelectTool(this.shapeSelectionService);
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.vertexDrawer = vertexDrawer;
        this.shapeIdService = shapeIdService;
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

    selectBoxResizeTool(shape: BoxShape, resizeType: ResizeType): void {
        const boxResizeTool = new BoxResizeTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer, shape, resizeType);
        this.setTool(boxResizeTool);
    }

    selectBoxMoveTool(shape: BoxShape): void {
        const boxMoveTool = new BoxMoveTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer, shape);
        this.setTool(boxMoveTool);
    }

    selectBoxEditTool(shape: BoxShape): void {
        const boxEditTool = new BoxEditTool(this, this.layerService, this.shapeSelectionService, this.selectBoxDrawer, shape);
        this.setTool(boxEditTool);
    }

    selectArrowEditTool(shape: ArrowShape): void {
        const arrowEditTool = new ArrowEditTool(this, this.layerService, this.shapeSelectionService, this.vertexDrawer, this.arrowVertexFactory, shape);
        this.setTool(arrowEditTool);
    }

    selectArrowFlipTool(shape: ArrowShape): void {
        const arrowFlipTool = new ArrowFlipTool(this, this.layerService, this.vertexDrawer, this.arrowVertexFactory, shape);
        this.setTool(arrowFlipTool);
    }

    selectArrowModifyTool(shape: ArrowShape, moveType: ArrowModifyType): void {
        const arrowModifyTool = new ArrowModifyTool(this, this.layerService, this.vertexDrawer, this.arrowVertexFactory, this.arrowDrawer, shape, moveType);
        this.setTool(arrowModifyTool);
    }

    selectTextEditTool(shape: TextShape): void {
        const textEditTool = new TextEditTool(this.layerService, this, this.shapeIdService, this.textDrawer, this.cursorDrawer,
            this.vertexDrawer, this.shapeSelectionService, shape);
        this.setTool(textEditTool);
    }

    selectTextMoveTool(shape: TextShape): void {
        const textMoveTool = new TextMoveTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer,
            this.vertexDrawer, this.textDrawer, shape);
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
