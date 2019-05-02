class TextTool implements Tool {

    private readonly grid: Grid;
    private modifiedCells = new Set<Cell>();
    private currentCell: Cell | null = null;
    private startCell: Cell | null = null;


    constructor(grid: Grid) {
        this.grid = grid;
    }

    start(row: number, column: number): void {
        this.done();
        this.currentCell = this.grid.cell(row, column);
        this.startCell = this.grid.cell(row, column);
        this.alterCell(row, column, "");
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
            console.log("End");
            this.done();
            return;
        }

        if (key === "Backspace") {
            if (column > this.startCell.column) {
                this.grid.unselectCell(row, column);
                this.alterCell(row, column - 1, "");
                this.currentCell = this.grid.cell(row, column - 1);
            }
            return;
        }

        if (key.length > 1) {
            return;
        }

        this.alterCell(row, column, key);
        this.currentCell = this.grid.cell(row, column + 1);
        this.alterCell(row, column + 1, "");
    }

    private done() {
        this.modifiedCells.forEach(cell => {
            this.grid.unselectCell(cell.row, cell.column);
        });
        this.modifiedCells.clear();
        this.startCell = null;
        this.currentCell = null;
    }

    drag(startRow: number, startColumn: number, row: number, column: number): void {
    }

    end(row: number, column: number): void {
    }
}
