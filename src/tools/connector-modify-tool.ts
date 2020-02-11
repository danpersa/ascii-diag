import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ConnectorShape} from "../shapes/connector-shape";
import {Vertex} from "../drawers/vertex";
import {Connector} from "../drawers/connector";
import {LayerService} from "../layer-service";
import {ConnectorVertexFactory} from "./connector-vertex-factory";
import {ConnectorDrawer} from "../drawers/connector-drawer";
import {AppState} from "../ui/app-state";

export enum ConnectorMoveType {
    StartMove,
    EndMove
}

export class ConnectorModifyTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly connectorVertexFactory: ConnectorVertexFactory;
    private readonly connectorDrawer: ConnectorDrawer;


    private readonly shape: ConnectorShape;
    private readonly moveType: ConnectorMoveType;
    private startConnectorVertex: Vertex;
    private endConnectorVertex: Vertex;
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
        this.startConnectorVertex = connectorVertexFactory.createStartVertex(shape);
        this.endConnectorVertex = connectorVertexFactory.createEndVertex(shape);
        this.connector = new Connector(this.shape.startRow,
            this.shape.startColumn,
            this.shape.endRow,
            this.shape.endColumn,
            this.shape.startDirection,
            this.shape.lineStyle,
            this.shape.startTipStyle,
            this.shape.endTipStyle);
        this.shape.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    render() {
        this.connectorDrawer.draw(this.connector);
        if (this.moveType == ConnectorMoveType.StartMove) {
            this.vertexDrawer.draw(this.startConnectorVertex);
        } else {
            this.vertexDrawer.draw(this.endConnectorVertex);
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        document.body.style.cursor = 'move';
        if (this.moveType === ConnectorMoveType.StartMove) {
            this.connector = new Connector(row,
                column,
                this.shape.endRow,
                this.shape.endColumn,
                this.shape.startDirection,
                this.shape.lineStyle,
                this.shape.startTipStyle,
                this.shape.endTipStyle);
            this.startConnectorVertex = this.connectorVertexFactory.createStartVertex(this.connector);
        } else {
            this.connector = new Connector(this.shape.startRow,
                this.shape.startColumn,
                row,
                column,
                this.shape.startDirection,
                this.shape.lineStyle,
                this.shape.startTipStyle,
                this.shape.endTipStyle);
            this.endConnectorVertex = this.connectorVertexFactory.createEndVertex(this.connector);
        }
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        if (this.moveType === ConnectorMoveType.StartMove) {
            const shape = new ConnectorShape(
                this.shape.id(),
                this.connector.startRow,
                this.connector.startColumn,
                this.shape.endRow,
                this.shape.endColumn,
                this.shape.startDirection,
                this.shape.lineStyle,
                this.shape.startTipStyle,
                this.shape.endTipStyle
            );
            this.layerService.updateShape(shape);
            this.toolService.selectConnectorEditTool(shape);
        } else {
            const shape = new ConnectorShape(
                this.shape.id(),
                this.shape.startRow,
                this.shape.startColumn,
                this.connector.endRow,
                this.connector.endColumn,
                this.shape.startDirection,
                this.shape.lineStyle,
                this.shape.startTipStyle,
                this.shape.endTipStyle
            );
            this.layerService.updateShape(shape);
            this.toolService.selectConnectorEditTool(shape);
        }
        this.shape.endEditing();
    }

    keyDown(key: string): void {
    }

    persist(appState: Readonly<AppState>): void {

    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
