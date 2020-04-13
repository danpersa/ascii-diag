import {Connector, ConnectorTipDirection, ConnectorTipStyle, LineStyle} from "../entities/connector";
import {Drawer} from "./drawer";
import {Grid} from "../entities/grid";
import {Cell} from "../entities/cell";
import {Constants} from "../constants";

export interface ConnectorDrawer extends Drawer<Connector> {
}

export abstract class AbstractConnectorDrawer implements ConnectorDrawer {

    constructor() {
    }

    abstract drawCell(cell: Cell): void;

    draw(connector: Connector): void {
        this.drawHorizontalEdge(connector);
        this.drawVerticalEdge(connector);
        this.drawIntersectionPoint(connector);
    }

    private drawIntersectionPoint(connector: Connector) {
        if (connector.intersectionPoint === null) {
            return;
        }
        let cell = Cell.Builder.from(connector.intersectionPoint.row, connector.intersectionPoint.column)
            .text('+')
            .build();
        this.drawCell(cell);
    }

    private drawHorizontalEdge(connector: Connector) {
        if (connector.horizontalEdge === null) {
            return;
        }
        const lineStyleSymbol = this.lineStyleSymbol(connector);
        const row = connector.horizontalEdge.start.row;
        const startColumn = connector.horizontalEdge.start.column;
        const endColumn = connector.horizontalEdge.end.column;
        const minColumn = Math.min(startColumn, endColumn);
        const maxColumn = Math.max(startColumn, endColumn);
        //console.log("Min column: " + minColumn + " maxColumn: " + maxColumn);
        for (let column = minColumn; column <= maxColumn; ++column) {
            if (column === minColumn) {
                if (connector.intersectionPoint && connector.intersectionPoint.column === column) {
                    continue;
                }
                const tipSymbol = this.tipSymbol(ConnectorTipDirection.West, connector.horizontalTipStyle);
                const cell = Cell.Builder.from(row, column).text(tipSymbol).build();
                this.drawCell(cell);
            } else if (column === maxColumn) {
                if (connector.intersectionPoint && connector.intersectionPoint.column === column) {
                    continue;
                }
                const tipSymbol = this.tipSymbol(ConnectorTipDirection.East, connector.horizontalTipStyle);
                const cell = Cell.Builder.from(row, column).text(tipSymbol).build();
                this.drawCell(cell);
            } else if (column === minColumn + 1 && lineStyleSymbol) {
                const cell = Cell.Builder.from(row, column).text(lineStyleSymbol).build();
                this.drawCell(cell);
            } else {
                const cell = Cell.Builder.from(row, column).text("-").build();
                this.drawCell(cell);
            }
        }
    }

    private drawVerticalEdge(connector: Connector) {
        if (connector.verticalEdge === null) {
            return;
        }
        const lineStyleSymbol = this.lineStyleSymbol(connector);
        const column = connector.verticalEdge.start.column;
        const startRow = connector.verticalEdge.start.row;
        const endRow = connector.verticalEdge.end.row;
        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);
        //console.log("Min row: " + minRow + " maxRow: " + maxRow + " startColumn: " + column + " endColumn: " + connector.verticalEdge.end.column);
        for (let row = minRow; row <= maxRow; ++row) {
            // draw the line style symbol first
            if (row === minRow) {
                if (connector.intersectionPoint && connector.intersectionPoint.row === row) {
                    continue;
                }
                const tipSymbol = this.tipSymbol(ConnectorTipDirection.North, connector.verticalTipStyle);
                const cell = Cell.Builder.from(row, column).text(tipSymbol).build();
                this.drawCell(cell);
            } else if (row === maxRow) {
                if (connector.intersectionPoint && connector.intersectionPoint.row === row) {
                    continue;
                }
                const tipSymbol = this.tipSymbol(ConnectorTipDirection.South, connector.verticalTipStyle);
                const cell = Cell.Builder.from(row, column).text(tipSymbol).build();
                this.drawCell(cell);
            } else if (row == minRow + 1 && lineStyleSymbol) {
                const cell = Cell.Builder.from(row, column).text(lineStyleSymbol).build();
                this.drawCell(cell);
            } else {
                const cell = Cell.Builder.from(row, column).text("|").build();
                this.drawCell(cell);
            }
        }
    }

    private lineStyleSymbol(connector: Connector): string {
        switch (connector.lineStyle) {
            case LineStyle.Dotted:
                return Constants.dottedLineSymbol;
            case LineStyle.Dashed:
                return Constants.dashedLineSymbol;
            case LineStyle.Continuous:
                return Constants.continuousLineSymbol;
        }
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

export class GridConnectorDrawer extends AbstractConnectorDrawer {
    private readonly grid: Grid;

    constructor(grid: Grid) {
        super();
        this.grid = grid;
    }

    drawCell(cell: Cell): void {
        this.grid.setTextForCell(cell.row, cell.column, cell.text);
    }
}
