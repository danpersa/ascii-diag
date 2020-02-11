import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {ConnectorDrawer} from "../drawers/connector-drawer";
import {ShapeIdService} from "../shapes/shape-id-service";
import {Connector} from "../drawers/connector";
import {ConnectorShape} from "../shapes/connector-shape";
import Constants from "../constants";
import {AppState} from "../ui/app-state";
import {StateProvider} from "../ui/state-provider";

export class ConnectorCreateTool implements Tool {

    private readonly connectorDrawer: ConnectorDrawer;
    private readonly layerService: LayerService;
    private readonly shapeIdService: ShapeIdService;
    private startRow: number = 0;
    private startColumn: number = 0;
    private endRow: number = 0;
    private endColumn: number = 0;
    private connector: Connector | null = null;

    constructor(layerService: LayerService, shapeIdService: ShapeIdService, connectorDrawer: ConnectorDrawer) {
        this.layerService = layerService;
        this.connectorDrawer = connectorDrawer;
        this.shapeIdService = shapeIdService;
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        this.startRow = row;
        this.startColumn = column;
        this.connector = new Connector(row,
            column,
            row,
            column,
            Constants.connectorStartDirection,
            appState.connectorLineStyle,
            appState.connectorStartTipStyle,
            appState.connectorEndTipStyle);
        console.log("End tip style: " + this.connector.endTipStyle);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        this.connector = new Connector(startRow,
            startColumn,
            row,
            column,
            Constants.connectorStartDirection,
            appState.connectorLineStyle,
            appState.connectorStartTipStyle,
            appState.connectorEndTipStyle);
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        this.endRow = row;
        this.endColumn = column;
        this.persist(appState);
        this.connector = null;
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    persist(appState: Readonly<AppState>): void {
        const shape = new ConnectorShape(
            this.shapeIdService.nextId(),
            this.startRow,
            this.startColumn,
            this.endRow,
            this.endColumn,
            Constants.connectorStartDirection,
            appState.connectorLineStyle,
            appState.connectorStartTipStyle,
            appState.connectorEndTipStyle);
        this.layerService.createShape(shape);
    }

    render(): void {
        if (this.connector) {
            this.connectorDrawer.draw(this.connector);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
