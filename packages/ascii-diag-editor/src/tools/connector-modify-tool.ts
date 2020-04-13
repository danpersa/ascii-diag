import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {Connector, ConnectorShape, GridPoint} from "ascii-diag-renderer";
import {Vertex} from "../entities/vertex";
import {LayerService} from "../layer-service";
import {ConnectorVertexFactory} from "./connector-vertex-factory";
import {ConnectorDrawer} from "ascii-diag-renderer";
import {AppState} from "../ui/app-state";

export enum ConnectorMoveType {
    HorizontalEdgeMove,
    VerticalEdgeMove
}

export class ConnectorModifyTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly connectorVertexFactory: ConnectorVertexFactory;
    private readonly connectorDrawer: ConnectorDrawer;


    private readonly shape: ConnectorShape;
    private readonly moveType: ConnectorMoveType;
    private horizontalEdgeVertex: Vertex;
    private verticalEdgeVertex: Vertex;
    private connector: Connector;

    constructor(toolService: ToolService, layerService: LayerService, vertexDrawer: VertexDrawer,
                connectorVertexFactory: ConnectorVertexFactory, connectorDrawer: ConnectorDrawer,
                shape: ConnectorShape, moveType: ConnectorMoveType) {
        this.toolService = toolService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.layerService = layerService;
        this.connectorVertexFactory = connectorVertexFactory;
        this.connectorDrawer = connectorDrawer;
        this.moveType = moveType;
        this.horizontalEdgeVertex = connectorVertexFactory.createHorizontalVertex(shape);
        this.verticalEdgeVertex = connectorVertexFactory.createVerticalVertex(shape);
        this.connector = Connector.Builder.from(this.shape).build();
        this.shape.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    render() {
        this.connectorDrawer.draw(this.connector);
        if (this.moveType == ConnectorMoveType.HorizontalEdgeMove) {
            this.vertexDrawer.draw(this.horizontalEdgeVertex);
        } else {
            this.vertexDrawer.draw(this.verticalEdgeVertex);
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        document.body.style.cursor = 'move';
        if (this.moveType === ConnectorMoveType.HorizontalEdgeMove) {
            const horizontalEdgeStartPoint: GridPoint = {row: row, column: column};
            const verticalEdgeStartPoint = this.verticalEdgeStartPoint();
            const intersectionPoint: GridPoint = {
                row: horizontalEdgeStartPoint.row,
                column: verticalEdgeStartPoint.column
            };
            this.connector = Connector.createByStartPoints(horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint,
                this.shape.lineStyle,
                this.shape.horizontalTipStyle,
                this.shape.verticalTipStyle);
            this.horizontalEdgeVertex = this.connectorVertexFactory.createHorizontalVertex(this.connector);
        } else {
            const verticalEdgeStartPoint: GridPoint = {row: row, column: column};
            const horizontalEdgeStartPoint = this.horizontalEdgeStartPoint();
            const intersectionPoint: GridPoint = {
                row: horizontalEdgeStartPoint.row,
                column: verticalEdgeStartPoint.column
            };
            this.connector = Connector.createByStartPoints(horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint,
                this.shape.lineStyle,
                this.shape.horizontalTipStyle,
                this.shape.verticalTipStyle);
            this.verticalEdgeVertex = this.connectorVertexFactory.createVerticalVertex(this.connector);
        }
    }

    private verticalEdgeStartPoint(): GridPoint {
        if (this.shape.verticalEdge !== null) {
            return this.shape.verticalEdge.start;
        } else if (this.shape.horizontalEdge !== null) {
            return this.shape.horizontalEdge.end;
        } else {
            return this.shape.intersectionPoint!;
        }
    }

    private horizontalEdgeStartPoint(): GridPoint {
        if (this.shape.horizontalEdge !== null) {
            return this.shape.horizontalEdge.start;
        } else if (this.shape.verticalEdge !== null) {
            return this.shape.verticalEdge.end;
        } else {
            return this.shape.intersectionPoint!;
        }
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        const shape = new ConnectorShape(this.shape.id(), this.connector.connectorType, this.shape.lineStyle, this.shape.horizontalTipStyle, this.shape.verticalTipStyle);
        this.layerService.updateShape(shape);
        this.toolService.selectConnectorEditTool(shape);
        this.shape.endEditing();
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    beforeToolChange(tool: Tool): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
