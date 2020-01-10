import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ArrowEntity} from "../entities/arrow-entity";
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


    private readonly entity: ArrowEntity;
    private readonly moveType: ArrowModifyType;
    private startArrowVertex: Vertex;
    private endArrowVertex: Vertex;
    private arrow: Arrow;

    constructor(toolService: ToolService, layerService: LayerService, vertexDrawer: VertexDrawer,
                arrowVertexFactory: ArrowVertexFactory, arrowDrawer: ArrowDrawer,
                entity: ArrowEntity, moveType: ArrowModifyType) {
        this.toolService = toolService;
        this.vertexDrawer = vertexDrawer;
        this.entity = entity;
        this.layerService = layerService;
        this.arrowVertexFactory = arrowVertexFactory;
        this.arrowDrawer = arrowDrawer;
        this.moveType = moveType;
        this.startArrowVertex = arrowVertexFactory.createStartArrowVertex(entity);
        this.endArrowVertex = arrowVertexFactory.createEndArrowVertex(entity);
        this.arrow = new Arrow(this.entity.startRow, this.entity.startColumn, this.entity.endRow,
            this.entity.endColumn, this.entity.startDirection);
        this.entity.startEditing();
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
            this.arrow = new Arrow(row, column, this.entity.endRow, this.entity.endColumn, this.entity.startDirection);
            this.startArrowVertex = this.arrowVertexFactory.createStartArrowVertex(this.arrow);
        } else {
            this.arrow = new Arrow(this.entity.startRow, this.entity.startColumn, row, column, this.entity.startDirection);
            this.endArrowVertex = this.arrowVertexFactory.createEndArrowVertex(this.arrow);
        }
    }

    mouseUp(row: number, column: number): void {
        if (this.moveType === ArrowModifyType.StartMove) {
            const entity = new ArrowEntity(
                this.entity.id(),
                this.arrow.startRow,
                this.arrow.startColumn,
                this.entity.endRow,
                this.entity.endColumn,
                this.entity.startDirection
            );
            this.layerService.updateEntity(entity);
            this.toolService.selectArrowEditTool(entity);
        } else {
            const entity = new ArrowEntity(
                this.entity.id(),
                this.entity.startRow,
                this.entity.startColumn,
                this.arrow.endRow,
                this.arrow.endColumn,
                this.entity.startDirection
            );
            this.layerService.updateEntity(entity);
            this.toolService.selectArrowEditTool(entity);
        }
        this.entity.endEditing();
    }

    keyDown(key: string): void {
    }

    persist(): void {

    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
