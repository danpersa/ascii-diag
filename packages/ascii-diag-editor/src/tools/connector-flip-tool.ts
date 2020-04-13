import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ConnectorShape, GridPoint, isEdgedConnector} from "ascii-diag-renderer";
import {Vertex} from "../entities/vertex";
import {LayerService} from "../layer-service";
import {ConnectorVertexFactory} from "./connector-vertex-factory";
import {AppState} from "../ui/app-state";

export class ConnectorFlipTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly connectorVertexFactory: ConnectorVertexFactory;

    private readonly shape: ConnectorShape;
    private readonly flipVertex: Vertex | null;

    constructor(toolService: ToolService, layerService: LayerService, vertexDrawer: VertexDrawer,
                connectorVertexFactory: ConnectorVertexFactory, shape: ConnectorShape) {
        this.toolService = toolService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.layerService = layerService;
        this.connectorVertexFactory = connectorVertexFactory;
        this.flipVertex = connectorVertexFactory.createFlipVertex(shape.connectorType);
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    render() {
        if (this.flipVertex) {
            this.vertexDrawer.draw(this.flipVertex);
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        document.body.style.cursor = 'pointer';
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        const shape = this.getFlipedConnector();

        this.layerService.updateShape(shape);
        this.toolService.selectConnectorEditTool(shape);
    }

    private getFlipedConnector(): ConnectorShape {
        const connectorType = this.shape.connectorType;
        if (!isEdgedConnector(connectorType)) {
            return this.shape;
        }

        const newIntersectionPoint: GridPoint = {
            row: connectorType.verticalEdge.start.row,
            column: connectorType.horizontalEdge.start.column
        };

        const newConnectorType = {
            horizontalEdge: {start: connectorType.verticalEdge.start, end: newIntersectionPoint},
            intersectionPoint: newIntersectionPoint,
            verticalEdge: {start: connectorType.horizontalEdge.start, end: newIntersectionPoint}
        };

        return ConnectorShape.ShapeBuilder.from(this.shape)
            .connectorType(newConnectorType)
            .build();
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    beforeToolChange(tool: Tool): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
