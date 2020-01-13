import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ArrowShape} from "../shapes/arrow-shape";
import {Vertex} from "../drawers/vertex";
import {Arrow} from "../drawers/arrow";
import {LayerService} from "../layer-service";
import {ArrowVertexFactory} from "./arrow-vertex-factory";
import {ArrowDrawer} from "../drawers/arrow-drawer";

export enum ArrowModifyType {
    StartMove,
    EndMove
}

export class ArrowModifyTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly arrowVertexFactory: ArrowVertexFactory;
    private readonly arrowDrawer: ArrowDrawer;


    private readonly shape: ArrowShape;
    private readonly moveType: ArrowModifyType;
    private startArrowVertex: Vertex;
    private endArrowVertex: Vertex;
    private arrow: Arrow;

    constructor(toolService: ToolService, layerService: LayerService, vertexDrawer: VertexDrawer,
                arrowVertexFactory: ArrowVertexFactory, arrowDrawer: ArrowDrawer,
                shape: ArrowShape, moveType: ArrowModifyType) {
        this.toolService = toolService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.layerService = layerService;
        this.arrowVertexFactory = arrowVertexFactory;
        this.arrowDrawer = arrowDrawer;
        this.moveType = moveType;
        this.startArrowVertex = arrowVertexFactory.createStartArrowVertex(shape);
        this.endArrowVertex = arrowVertexFactory.createEndArrowVertex(shape);
        this.arrow = new Arrow(this.shape.startRow, this.shape.startColumn, this.shape.endRow,
            this.shape.endColumn, this.shape.startDirection);
        this.shape.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
    }

    render() {
        this.arrowDrawer.draw(this.arrow);
        if (this.moveType == ArrowModifyType.StartMove) {
            this.vertexDrawer.draw(this.startArrowVertex);
        } else {
            this.vertexDrawer.draw(this.endArrowVertex);
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        document.body.style.cursor = 'move';
        if (this.moveType === ArrowModifyType.StartMove) {
            this.arrow = new Arrow(row, column, this.shape.endRow, this.shape.endColumn, this.shape.startDirection);
            this.startArrowVertex = this.arrowVertexFactory.createStartArrowVertex(this.arrow);
        } else {
            this.arrow = new Arrow(this.shape.startRow, this.shape.startColumn, row, column, this.shape.startDirection);
            this.endArrowVertex = this.arrowVertexFactory.createEndArrowVertex(this.arrow);
        }
    }

    mouseUp(row: number, column: number): void {
        if (this.moveType === ArrowModifyType.StartMove) {
            const shape = new ArrowShape(
                this.shape.id(),
                this.arrow.startRow,
                this.arrow.startColumn,
                this.shape.endRow,
                this.shape.endColumn,
                this.shape.startDirection
            );
            this.layerService.updateShape(shape);
            this.toolService.selectArrowEditTool(shape);
        } else {
            const shape = new ArrowShape(
                this.shape.id(),
                this.shape.startRow,
                this.shape.startColumn,
                this.arrow.endRow,
                this.arrow.endColumn,
                this.shape.startDirection
            );
            this.layerService.updateShape(shape);
            this.toolService.selectArrowEditTool(shape);
        }
        this.shape.endEditing();
    }

    keyDown(key: string): void {
    }

    persist(): void {

    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
