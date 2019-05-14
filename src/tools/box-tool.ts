import {Tool} from "./tool";
import Grid from "../grid";
import {Domain} from "../cell";
import Cell = Domain.Cell;
import {LayerService} from "../layer-service";
import {BoxEntity} from "../entities/box-entity";
import {BoxDrawer} from "../box-drawer";
import {Box} from "../box";
import {EntityIdService} from "../entities/entity-id-service";

export class BoxTool implements Tool {

    private readonly grid: Grid;
    private readonly layerService: LayerService;
    private readonly boxDrawer: BoxDrawer;
    private readonly entityIdService: EntityIdService;
    private modifiedCells = new Set<Cell>();
    private startRow: number = 0;
    private startColumn: number = 0;
    private endRow: number = 0;
    private endColumn: number = 0;
    private box: Box | null = null;

    constructor(grid: Grid, layerService: LayerService, boxDrawer: BoxDrawer, entityIdService: EntityIdService) {
        this.grid = grid;
        this.layerService = layerService;
        this.boxDrawer = boxDrawer;
        this.entityIdService = entityIdService;
    }

    mouseDown(row: number, column: number, x: number, y: number): boolean {
        const currentCell = this.grid.cell(row, column);
        this.modifiedCells.add(currentCell);
        this.grid.selectCell(row, column);
        this.grid.valueCell(row, column, "+");
        this.startRow = row;
        this.startColumn = column;
        return true;
    }

    private alterCell(row: number, column: number, value: string) {
        const currentCell = this.grid.cell(row, column);
        this.modifiedCells.add(currentCell);
        this.grid.selectCell(row, column);
        this.grid.valueCell(row, column, value);
    }


    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean {
        this.modifiedCells.forEach(cell => {
            this.grid.switchCell(cell);
        });

        const minRow = Math.min(startRow, row);
        const maxRow = Math.max(startRow, row);
        const minColumn = Math.min(startColumn, column);
        const maxColumn = Math.max(startColumn, column);

        this.box = new Box(minRow, minColumn, maxRow, maxColumn);

        //
        //
        // // start corner
        // this.alterCell(startRow, startColumn, "+");
        //
        // // start horizontal edge
        // for (let i = minColumn + 1; i < maxColumn; i++) {
        //     this.alterCell(startRow, i, "-");
        // }
        //
        // for (let i = minRow + 1; i < maxRow; i++) {
        //     this.alterCell(i, startColumn, "|");
        // }
        //
        // if (minColumn != maxColumn) {
        //     for (let i = minRow + 1; i < maxRow; i++) {
        //         this.alterCell(i, column, "|");
        //     }
        //
        //     // horizontal corner
        //     this.alterCell(startRow, column, "+");
        // }
        //
        // if (minRow != maxRow) {
        //     for (let i = minColumn + 1; i < maxColumn; i++) {
        //         this.alterCell(row, i, "-");
        //     }
        //
        //     // vertical corner
        //     this.alterCell(row, startColumn, "+");
        // }
        //
        // if (minRow != maxRow && minColumn != maxColumn) {
        //     // end corner
        //     this.alterCell(row, column, "+");
        // }
        return true;
    }

    mouseUp(row: number, column: number): boolean {
        this.endRow = row;
        this.endColumn = column;
        this.modifiedCells.forEach(cell => {
            this.grid.unselectCell(cell.row, cell.column);
        });
        this.modifiedCells.clear();
        this.persist();
        this.box = null;
        return true;
    }

    keyDown(key: string): boolean {
        return false;
    }

    persist(): void {
        const entity = new BoxEntity(
            this.entityIdService.nextId(),
            Math.min(this.startRow, this.endRow),
            Math.min(this.startColumn, this.endColumn),
            Math.max(this.startRow, this.endRow),
            Math.max(this.startColumn, this.endColumn));
        this.layerService.createEntity(entity);
    }

    render(): void {
        if (this.box) {
            this.boxDrawer.draw(this.box);
        }
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): boolean {
        return false;
    }
}
