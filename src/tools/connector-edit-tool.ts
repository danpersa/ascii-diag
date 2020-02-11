import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ConnectorShape} from "../shapes/connector-shape";
import {Vertex} from "../drawers/vertex";
import {ConnectorVertexFactory} from "./connector-vertex-factory";
import {ConnectorMoveType} from "./connector-modify-tool";
import {LayerService} from "../layer-service";
import {AppState} from "../ui/app-state";
import {StateProvider} from "../ui/state-provider";

export class ConnectorEditTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;

    private readonly shape: ConnectorShape;
    private readonly flipVertex: Vertex | null;
    private readonly startConnectorVertex: Vertex;
    private readonly endConnectorVertex: Vertex;

    constructor(toolService: ToolService, layerService: LayerService,
                vertexDrawer: VertexDrawer,
                connectorVertexFactory: ConnectorVertexFactory, shape: ConnectorShape) {
        this.toolService = toolService;
        this.layerService = layerService;
        this.vertexDrawer = vertexDrawer;
        this.shape = shape;
        this.flipVertex = connectorVertexFactory.createFlipVertex(shape);
        this.startConnectorVertex = connectorVertexFactory.createStartVertex(shape);
        this.endConnectorVertex = connectorVertexFactory.createEndVertex(shape);
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        console.log("Connector Edit Tool click on row: " + row + " column=" + column);

        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            this.toolService.selectConnectorFlipTool(this.shape)
        } else if (this.startConnectorVertex.containsPoint(x, y)) {
            this.toolService.selectConnectorModifyTool(this.shape, ConnectorMoveType.StartMove);
        } else if (this.endConnectorVertex.containsPoint(x, y)) {
            this.toolService.selectConnectorModifyTool(this.shape, ConnectorMoveType.EndMove);
        } else {
            this.toolService.selectShapeFor(row, column);
        }
    }

    render() {
        if (this.flipVertex) {
            this.vertexDrawer.draw(this.flipVertex);
        }
        this.vertexDrawer.draw(this.startConnectorVertex);
        this.vertexDrawer.draw(this.endConnectorVertex);
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

    persist(appState: Readonly<AppState>): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        if (this.flipVertex && this.flipVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'pointer';
        } else if (this.startConnectorVertex.containsPoint(x, y) || this.endConnectorVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
