import {Tool} from "./tool";
import Grid from "../grid";
import {Domain} from "../cell";
import Cell = Domain.Cell;
import {LayerService} from "../layer-service";

export class BoxTool implements Tool {

    private readonly grid: Grid;
    private readonly layerService: LayerService;
    private modifiedCells = new Set<Cell>();

    constructor(grid: Grid, layerService: LayerService) {
        this.grid = grid;
        this.layerService = layerService;
    }

    clickDown(row: number, column: number): void {
        const currentCell = this.grid.cell(row, column);
        this.modifiedCells.add(currentCell);
        this.grid.selectCell(row, column);
        this.grid.valueCell(row, column, "+");
    }

    private alterCell(row: number, column: number, value: string) {
        const currentCell = this.grid.cell(row, column);
        this.modifiedCells.add(currentCell);
        this.grid.selectCell(row, column);
        this.grid.valueCell(row, column, value);
    }


    drag(startRow: number, startColumn: number, row: number, column: number): void {
        this.modifiedCells.forEach(cell => {
            this.grid.switchCell(cell);
        });

        const minRow = Math.min(startRow, row);
        const maxRow = Math.max(startRow, row);
        const minColumn = Math.min(startColumn, column);
        const maxColumn = Math.max(startColumn, column);

        // start corner
        this.alterCell(startRow, startColumn, "+");

        // start horizontal edge
        for (let i = minColumn + 1; i < maxColumn; i++) {
            this.alterCell(startRow, i, "-");
        }

        for (let i = minRow + 1; i < maxRow; i++) {
            this.alterCell(i, startColumn, "|");
        }

        if (minColumn != maxColumn) {
            for (let i = minRow + 1; i < maxRow; i++) {
                this.alterCell(i, column, "|");
            }

            // horizontal corner
            this.alterCell(startRow, column, "+");
        }

        if (minRow != maxRow) {
            for (let i = minColumn + 1; i < maxColumn; i++) {
                this.alterCell(row, i, "-");
            }

            // vertical corner
            this.alterCell(row, startColumn, "+");
        }

        if (minRow != maxRow && minColumn != maxColumn) {
            // end corner
            this.alterCell(row, column, "+");
        }
    }

    endDrag(row: number, column: number): void {
        this.modifiedCells.forEach(cell => {
            this.grid.unselectCell(cell.row, cell.column);
        });
        this.modifiedCells.clear();
    }

    keyDown(key: string): void {
    }

    persist(): void {
        throw new Error("Method not implemented.");
    }
}
