import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ConnectorShape} from "../shapes/connector-shape";
import {Vertex} from "../drawers/vertex";
import {ConnectorDirection} from "../drawers/connector";
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
        this.flipVertex = connectorVertexFactory.createFlipVertex(shape);
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
        const newConnectorDirection = this.shape.startDirection === ConnectorDirection.Horizontal ? ConnectorDirection.Vertical : ConnectorDirection.Horizontal;

        const shape = ConnectorShape.ShapeBuilder.from(this.shape)
            .startDirection(newConnectorDirection)
            .build();

        this.layerService.updateShape(shape);
        this.toolService.selectConnectorEditTool(shape);
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    persist(appState: Readonly<AppState>): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
