import {Tool} from "./tool";
import Grid from "../grid";
import {Domain} from "../cell";
import Cell = Domain.Cell;
import {LayerService} from "../layer-service";
import {Entity} from "../entities/entity";
import {TextEntity} from "../entities/text-entity";
import {EntityIdService} from "../entities/entity-id-service";

export class TextTool implements Tool {

    private readonly grid: Grid;
    private readonly layerService: LayerService;
    private readonly entityIdService: EntityIdService;
    private modifiedCells = new Set<Cell>();
    private currentCell: Cell | null = null;
    private startCell: Cell | null = null;
    private currentText: string | null = null;

    constructor(grid: Grid, layerService: LayerService, entityIdService: EntityIdService) {
        this.grid = grid;
        this.layerService = layerService;
        this.entityIdService = entityIdService;
    }

    init(entity: TextEntity) {
        entity.cells().forEach(cell => {
            this.grid.selectCell(cell.row, cell.column);
            this.modifiedCells.add(this.grid.cell(cell.row, cell.column));
        });
        this.startCell = this.grid.cell(entity.row, entity.column);
        this.currentCell = this.grid.cell(entity.row, entity.column + entity.text.length);
        this.currentText = entity.text;
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        const entity = this.layerService.getEntity(row, column);
        console.log("Entity found: " + entity);
        //this.done();

        if (entity && entity instanceof TextEntity) {
            this.init(entity);
            return;
        }

        this.currentCell = this.grid.cell(row, column);
        this.startCell = this.grid.cell(row, column);
        this.currentText = "";
        this.alterCell(row, column, "");
        return;
    }

    private alterCell(row: number, column: number, value: string) {
        const currentCell = this.grid.cell(row, column);
        this.modifiedCells.add(currentCell);
        this.grid.selectCell(row, column);
        this.grid.valueCell(row, column, value);
    }

    keyDown(key: string): void {
        console.log("Pressed " + key);

        if (!this.startCell) {
            return;
        }

        const row = this.currentCell!.row;
        const column = this.currentCell!.column;

        if (key === "Enter") {
            console.log("Done");
            this.persist();
            this.done();
            return;
        }

        if (key === "Backspace") {
            if (column > this.startCell.column) {
                this.grid.unselectCell(row, column);
                this.alterCell(row, column - 1, "");
                this.currentCell = this.grid.cell(row, column - 1);
                this.currentText = this.currentText!.substr(0, this.currentText!.length - 1);
            }
            return;
        }

        if (key.length > 1) {
            return;
        }

        this.alterCell(row, column, key);
        this.currentText += key;
        this.currentCell = this.grid.cell(row, column + 1);
        this.alterCell(row, column + 1, "");
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
    }

    mouseUp(row: number, column: number): void {
    }

    done(): void {
        this.modifiedCells.forEach(cell => {
            this.grid.unselectCell(cell.row, cell.column);
        });
        this.modifiedCells.clear();
        this.startCell = null;
        this.currentCell = null;
        this.currentText = null;
    }

    persist(): void {
        const entity: Entity = new TextEntity(
            this.entityIdService.nextId(),
            this.startCell!.row,
            this.startCell!.column,
            this.currentText!);
        this.layerService.createEntity(entity);
    }

    render(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
