import {CellDrawer} from "./cell-drawer";
import {Connector, ConnectorDirection, ConnectorTipDirection, ConnectorTipStyle} from "./connector";
import {Domain} from "./cell";
import {ConnectorTipDirectionService} from "../connector-tip-direction-service";
import {Drawer} from "./drawer";
import Grid from "./grid";
import Cell = Domain.Cell;

export interface ConnectorDrawer extends Drawer<Connector> {
}

export abstract class AbstractConnectorDrawer implements ConnectorDrawer {

    private readonly connectorTipDirectionService: ConnectorTipDirectionService;

    constructor(connectorTipDirectionService: ConnectorTipDirectionService) {
        this.connectorTipDirectionService = connectorTipDirectionService;
    }

    abstract drawCell(cell: Cell): void;

    draw(connector: Connector): void {
        const startTipSymbol = this.startTipSymbol(connector);
        let cell = Cell.Builder.from(connector.startRow, connector.startColumn)
            .text(startTipSymbol)
            .build();
        this.drawCell(cell);

        const minColumn = Math.min(connector.startColumn, connector.endColumn);
        const maxColumn = Math.max(connector.startColumn, connector.endColumn);
        const minRow = Math.min(connector.startRow, connector.endRow);
        const maxRow = Math.max(connector.startRow, connector.endRow);
        const endTipSymbol = this.endTipSymbol(connector);

        if (connector.startDirection === ConnectorDirection.Horizontal) {
            for (let column = minColumn + 1; column < maxColumn; ++column) {
                const cell = Cell.Builder.from(connector.startRow, column).text("-").build();
                this.drawCell(cell);
            }
            if (connector.startRow == connector.endRow) {
                if (endTipSymbol) {
                    const cell = Cell.Builder.from(connector.startRow, connector.endColumn).text(endTipSymbol).build();
                    this.drawCell(cell);
                }
            } else {
                const cell = Cell.Builder.from(connector.startRow, connector.endColumn).text("+").build();
                this.drawCell(cell);
                for (let row = minRow + 1; row < maxRow; ++row) {
                    const cell = Cell.Builder.from(row, connector.endColumn).text("|").build();
                    this.drawCell(cell);
                }
                if (endTipSymbol) {
                    const cell = Cell.Builder.from(connector.endRow, connector.endColumn).text(endTipSymbol).build();
                    this.drawCell(cell);
                }
            }
        } else if (connector.startDirection === ConnectorDirection.Vertical) {
            for (let row = minRow + 1; row < maxRow; ++row) {
                const cell = Cell.Builder.from(row, connector.startColumn).text("|").build();
                this.drawCell(cell);
            }
            if (connector.startColumn == connector.endColumn) {
                if (endTipSymbol) {
                    const cell = Cell.Builder.from(connector.endRow, connector.endColumn).text(endTipSymbol).build();
                    this.drawCell(cell);
                }
            } else {
                const cell = Cell.Builder.from(connector.endRow, connector.startColumn).text("+").build();
                this.drawCell(cell);
                for (let column = minColumn + 1; column < maxColumn; ++column) {
                    const cell = Cell.Builder.from(connector.endRow, column).text("-").build();
                    this.drawCell(cell);
                }
                if (endTipSymbol) {
                    const cell = Cell.Builder.from(connector.endRow, connector.endColumn).text(endTipSymbol).build();
                    this.drawCell(cell);
                }
            }
        }
    }

    private endTipSymbol(connector: Connector): string {
        const tipDirection = this.connectorTipDirectionService.endTipDirection(connector);
        return this.tipSymbol(tipDirection, connector.endTipStyle);
    }

    private startTipSymbol(connector: Connector): string {
        const tipDirection = this.connectorTipDirectionService.startTipDirection(connector);
        return this.tipSymbol(tipDirection, connector.startTipStyle);
    }

    private tipSymbol(tipDirection: ConnectorTipDirection | null, tipStyle: ConnectorTipStyle) {
        switch (tipDirection) {
            case ConnectorTipDirection.North:
                return tipStyle === ConnectorTipStyle.Arrow ? "^" : "|";
            case ConnectorTipDirection.South:
                return tipStyle === ConnectorTipStyle.Arrow ? "v" : "|";
            case ConnectorTipDirection.East:
                return tipStyle === ConnectorTipStyle.Arrow ? ">" : "-";
            case ConnectorTipDirection.West:
                return tipStyle === ConnectorTipStyle.Arrow ? "<" : "-";
        }
        return "+";
    }
}

export class CanvasConnectorDrawer extends AbstractConnectorDrawer {

    private cellDrawer: CellDrawer;

    constructor(cellDrawer: CellDrawer, connectorTipDirectionService: ConnectorTipDirectionService) {
        super(connectorTipDirectionService);
        this.cellDrawer = cellDrawer;
    }

    drawCell(cell: Cell) {
        this.cellDrawer.draw(cell);
    }
}

export class ArrayConnectorDrawer extends AbstractConnectorDrawer {
    private readonly _cells: Array<Cell> = [];

    drawCell(cell: Cell): void {
        this._cells.push(cell);
    }

    get cells(): Array<Cell> {
        return this._cells;
    }
}

export class GridConnectorDrawer extends AbstractConnectorDrawer {
    private readonly grid: Grid;

    constructor(connectorTipDirectionService: ConnectorTipDirectionService, grid: Grid) {
        super(connectorTipDirectionService);
        this.grid = grid;
    }

    drawCell(cell: Cell): void {
        this.grid.setTextForCell(cell.row, cell.column, cell.text);
    }
}
