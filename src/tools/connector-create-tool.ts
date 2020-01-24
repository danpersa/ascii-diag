import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {ConnectorDrawer} from "../drawers/connector-drawer";
import {ShapeIdService} from "../shapes/shape-id-service";
import {Connector} from "../drawers/connector";
import {ConnectorShape} from "../shapes/connector-shape";
import Constants from "../constants";

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

    mouseDown(row: number, column: number, x: number, y: number): void {
        this.startRow = row;
        this.startColumn = column;
        this.connector = new Connector(row, column, row, column, Constants.connectorStartDirection);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
        this.connector = new Connector(startRow, startColumn, row, column, Constants.connectorStartDirection);
    }

    mouseUp(row: number, column: number): void {
        this.endRow = row;
        this.endColumn = column;
        this.persist();
        this.connector = null;
    }

    keyDown(key: string): void {
    }

    persist(): void {
        const shape = new ConnectorShape(
            this.shapeIdService.nextId(),
            this.startRow,
            this.startColumn,
            this.endRow,
            this.endColumn,
            Constants.connectorStartDirection);
        this.layerService.createShape(shape);
    }

    render(): void {
        if (this.connector) {
            this.connectorDrawer.draw(this.connector);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
