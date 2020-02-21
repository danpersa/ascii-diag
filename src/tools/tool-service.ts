import {SelectedShapeChangedListener, Tool, ToolChangedListener, Tools} from "./tool";
import {ConnectorCreateTool} from "./connector-create-tool";
import {BoxCreateTool} from "./box-create-tool";
import {TextCreateTool} from "./text-create-tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../drawers/select-box-drawer";
import {SelectTool} from "./select-tool";
import {BoxDrawer} from "../drawers/box-drawer";
import {ShapeIdService} from "../shapes/shape-id-service";
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
import {ConnectorDrawer} from "../drawers/connector-drawer";
import {ConnectorEditTool} from "./connector-edit-tool";
import {ConnectorShape} from "../shapes/connector-shape";
import {ConnectorFlipTool} from "./connector-flip-tool";
import {ConnectorVertexFactory} from "./connector-vertex-factory";
import {ConnectorModifyTool, ConnectorMoveType} from "./connector-modify-tool";
import {CellToShapeService} from "../cell-to-shape-service";
import {Shape} from "../shapes/shape";
import {ShapeUpdateEvent, ShapeUpdateListener} from "../shape-update-notification-service";
import {ShapeUpdateStylesTool} from "./shape-update-styles-tool";

export class ToolService implements ShapeUpdateListener {

    private readonly boxCreateTool: Tool;
    private readonly connectorCreateTool: Tool;
    private readonly textCreateTool: Tool;
    private readonly layerService: LayerService;
    private readonly selectTool: SelectTool;
    private readonly boxDrawer: BoxDrawer;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly shapeIdService: ShapeIdService;
    private readonly cursorDrawer: CursorDrawer;
    private readonly textDrawer: TextDrawer;
    private readonly vertexDrawer: VertexDrawer;
    private readonly connectorDrawer: ConnectorDrawer;
    private readonly connectorVertexFactory: ConnectorVertexFactory;
    private readonly cellToShapeService: CellToShapeService;
    private readonly toolStack: Array<Tool> = [];
    private readonly toolChangedListeners: Array<ToolChangedListener> = [];
    private readonly selectedShapeChangedListeners: Array<SelectedShapeChangedListener> = [];
    private _currentShape: Shape | undefined;

    constructor(layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, boxDrawer: BoxDrawer, shapeIdService: ShapeIdService,
                textDrawer: TextDrawer, cursorDrawer: CursorDrawer, vertexDrawer: VertexDrawer, connectorDrawer: ConnectorDrawer, cellToShapeService: CellToShapeService) {
        this.layerService = layerService;
        this.cursorDrawer = cursorDrawer;
        this.textDrawer = textDrawer;
        this.connectorDrawer = connectorDrawer;
        this.boxCreateTool = new BoxCreateTool(layerService, boxDrawer, shapeIdService);
        this.connectorCreateTool = new ConnectorCreateTool(layerService, shapeIdService, connectorDrawer);
        this.textCreateTool = new TextCreateTool(layerService, shapeIdService, textDrawer, cursorDrawer);
        this.connectorVertexFactory = new ConnectorVertexFactory();
        this.selectTool = new SelectTool(this);
        this.selectBoxDrawer = selectBoxDrawer;
        this.boxDrawer = boxDrawer;
        this.vertexDrawer = vertexDrawer;
        this.shapeIdService = shapeIdService;
        this.cellToShapeService = cellToShapeService;
        this.toolStack.push(this.connectorCreateTool);
    }

    setCurrentTool(tool: Tools): void {
        console.log("Set current tool: " + tool);
        switch (tool) {
            case Tools.connector:
                this.selectConnectorTool();
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
        this.notifySelectedShapeChangedListeners(undefined);
    }

    private popTool(): Tool {
        return this.toolStack.pop()!;
    }

    currentTool(): Tool {
        return this.toolStack[this.toolStack.length - 1];
    }

    currentShape(): Shape | undefined {
        return this._currentShape;
    }

    selectBoxTool(): void {
        this.setTool(this.boxCreateTool);
    }

    selectConnectorTool(): void {
        this.setTool(this.connectorCreateTool);
    }

    selectTextTool(): void {
        this.setTool(this.textCreateTool);
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
        const boxEditTool = new BoxEditTool(this, this.layerService, this.selectBoxDrawer, shape);
        this.setTool(boxEditTool);
    }

    selectShapeUpdateStylesTool(shape: Shape): void {
        const tool = new ShapeUpdateStylesTool(this, this.layerService, shape);
        this.setTool(tool);
    }

    selectConnectorEditTool(shape: ConnectorShape): void {
        const connectorEditTool = new ConnectorEditTool(this, this.layerService, this.vertexDrawer, this.connectorVertexFactory, shape);
        this.setTool(connectorEditTool);
    }

    selectShapeEditTool(shape: Shape): void {
        if (shape && shape instanceof TextShape) {
            this.selectTextEditTool(shape);
        } else if (shape && shape instanceof BoxShape) {
            this.selectBoxEditTool(shape);
        } else if (shape && shape instanceof ConnectorShape) {
            this.selectConnectorEditTool(shape);
        } else {
            this.selectSelectTool();
        }
    }

    selectConnectorFlipTool(shape: ConnectorShape): void {
        const connectorFlipTool = new ConnectorFlipTool(this, this.layerService, this.vertexDrawer, this.connectorVertexFactory, shape);
        this.setTool(connectorFlipTool);
    }

    selectConnectorModifyTool(shape: ConnectorShape, moveType: ConnectorMoveType): void {
        const connectorModifyTool = new ConnectorModifyTool(this, this.layerService, this.vertexDrawer, this.connectorVertexFactory, this.connectorDrawer, shape, moveType);
        this.setTool(connectorModifyTool);
    }

    selectTextEditTool(shape: TextShape): void {
        const textEditTool = new TextEditTool(this.layerService, this, this.shapeIdService, this.textDrawer, this.cursorDrawer,
            this.vertexDrawer, this.cellToShapeService, shape);
        this.setTool(textEditTool);
    }

    selectTextMoveTool(shape: TextShape): void {
        const textMoveTool = new TextMoveTool(this.layerService, this, this.selectBoxDrawer, this.boxDrawer,
            this.vertexDrawer, this.textDrawer, shape);
        this.setTool(textMoveTool);
    }

    private setTool(tool: Tool): void {
        const prevTool = this.popTool();
        this.toolStack.push(tool);
        this.notifyToolChangedListeners(prevTool, tool);
    }

    selectShapeFor(row: number, column: number) {
        const shape = this.cellToShapeService.getShape(row, column);
        if (shape) {
            console.log("Found shape: " + shape.constructor.name);
        } else {
            console.log("Didn't find shape");
        }

        if (shape && shape instanceof TextShape) {
            this.selectTextEditTool(shape);
        } else if (shape && shape instanceof BoxShape) {
            this.selectBoxEditTool(shape);
        } else if (shape && shape instanceof ConnectorShape) {
            this.selectConnectorEditTool(shape);
        } else {
            this.selectSelectTool();
        }
        this.notifySelectedShapeChangedListeners(shape);
    }

    registerSelectedShapeChangedListeners(listener: SelectedShapeChangedListener) {
        this.selectedShapeChangedListeners.push(listener);
    }

    registerToolChangedListener(listener: ToolChangedListener): void {
        this.toolChangedListeners.push(listener);
    }

    notifyToolChangedListeners(prevTool: Tool, tool: Tool): void {
        this.toolChangedListeners.forEach((listener: ToolChangedListener) => {
            listener.toolChanged(prevTool, tool);
        });
    }

    notifySelectedShapeChangedListeners(shape: Shape | undefined): void {
        this._currentShape = shape;
        this.selectedShapeChangedListeners.forEach((listener: SelectedShapeChangedListener) => {
            listener.shapeSelected(shape);
        });
    }

    update(event: ShapeUpdateEvent, shape: Shape): void {
        switch (event) {
            case ShapeUpdateEvent.UPDATED:
                this.notifySelectedShapeChangedListeners(shape);
                break;
            case ShapeUpdateEvent.DELETED:
                this.notifySelectedShapeChangedListeners(undefined);
                break;
        }
    }
}
