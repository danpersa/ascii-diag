import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {ConnectorDrawer} from "../drawers/connector-drawer";
import {ShapeIdService} from "../shapes/shape-id-service";
import {Connector, GridPoint} from "../drawers/connector";
import {ConnectorShape} from "../shapes/connector-shape";
import {AppState} from "../ui/app-state";

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

        const horizontalEdgeStartPoint: GridPoint = {row: row, column: column};
        const verticalEdgeStartPoint = {row: row, column: column};
        const intersectionPoint: GridPoint = {
            row: horizontalEdgeStartPoint.row,
            column: verticalEdgeStartPoint.column
        };

        this.connector = Connector.createByStartPoints(horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint,
            appState.connectorLineStyle, appState.connectorHorizontalTipStyle, appState.connectorVerticalTipStyle);
        console.log("End tip style: " + this.connector.verticalTipStyle);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        const horizontalEdgeStartPoint: GridPoint = {row: startRow, column: startColumn};
        const verticalEdgeStartPoint = {row: row, column: column};
        const intersectionPoint: GridPoint = {
            row: horizontalEdgeStartPoint.row,
            column: verticalEdgeStartPoint.column
        };

        this.connector = Connector.createByStartPoints(horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint,
            appState.connectorLineStyle, appState.connectorHorizontalTipStyle, appState.connectorVerticalTipStyle);
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
        this.endRow = row;
        this.endColumn = column;

        const horizontalEdgeStartPoint: GridPoint = {row: this.startRow, column: this.startColumn};
        const verticalEdgeStartPoint = {row: this.endRow, column: this.endColumn};
        const intersectionPoint: GridPoint = {
            row: horizontalEdgeStartPoint.row,
            column: verticalEdgeStartPoint.column
        };

        const shape = ConnectorShape.createShapeByStartPoints(this.shapeIdService.nextId(),
            horizontalEdgeStartPoint, intersectionPoint, verticalEdgeStartPoint,
            appState.connectorLineStyle, appState.connectorHorizontalTipStyle, appState.connectorVerticalTipStyle);
        this.layerService.createShape(shape);
        this.connector = null;
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    beforeToolChange(tool: Tool): void {
    }

    render(): void {
        if (this.connector) {
            this.connectorDrawer.draw(this.connector);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
