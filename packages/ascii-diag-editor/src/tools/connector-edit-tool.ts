import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ConnectorShape} from "ascii-diag-renderer";
import {Vertex} from "../entities/vertex";
import {ConnectorVertexFactory} from "./connector-vertex-factory";
import {ConnectorMoveType} from "./connector-modify-tool";
import {LayerService} from "../layer-service";
import {AppState} from "../ui/app-state";

export class ConnectorEditTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;

    private readonly shape: ConnectorShape;
    private readonly flipVertex: Vertex | null;
    private readonly horizontalConnectorVertex: Vertex;
    private readonly verticalConnectorVertex: Vertex;

    constructor(toolService: ToolService, layerService: LayerService,
                vertexDrawer: VertexDrawer,
                connectorVertexFactory: ConnectorVertexFactory, shape: ConnectorShape) {
        this.toolService = toolService;
        this.layerService = layerService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.flipVertex = connectorVertexFactory.createFlipVertex(shape.connectorType);
        this.horizontalConnectorVertex = connectorVertexFactory.createHorizontalVertex(shape);
        this.verticalConnectorVertex = connectorVertexFactory.createVerticalVertex(shape);
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        console.log("Connector Edit Tool click on row: " + row + " column=" + column);

        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            this.toolService.selectConnectorFlipTool(this.shape)
        } else if (this.horizontalConnectorVertex.containsPoint(x, y)) {
            this.toolService.selectConnectorModifyTool(this.shape, ConnectorMoveType.HorizontalEdgeMove);
        } else if (this.verticalConnectorVertex.containsPoint(x, y)) {
            this.toolService.selectConnectorModifyTool(this.shape, ConnectorMoveType.VerticalEdgeMove);
        } else {
            this.toolService.selectShapeFor(row, column);
        }
    }

    render() {
        if (this.flipVertex) {
            this.vertexDrawer.draw(this.flipVertex);
        }
        this.vertexDrawer.draw(this.horizontalConnectorVertex);
        this.vertexDrawer.draw(this.verticalConnectorVertex);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
        if (key === "Backspace" || key === "Delete") {
            this.layerService.deleteShape(this.shape.id());
            this.toolService.selectSelectTool();
        }
    }

    beforeToolChange(tool: Tool): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'pointer';
        } else if (this.horizontalConnectorVertex.containsPoint(x, y) || this.verticalConnectorVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
