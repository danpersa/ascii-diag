namespace Tools {
    export class ArrowTool implements Tool {

        private readonly grid: Grid;
        private modifiedCells = new Set<Cell>();


        constructor(grid: Grid) {
            this.grid = grid;
        }

        start(row: number, column: number): void {
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

        private arrowDirection(startRow: number, startColumn: number, row: number, column: number): string | null {
            // horizontal
            if (startRow == row) {
                if (startColumn > column) {
                    return "<";
                } else if (startColumn < column) {
                    return ">";
                } else {
                    return null;
                }
                // vertical
            } else if (startColumn == column) {
                if (startRow > row) {
                    return "^"; // ∧
                } else if (startRow < row) {
                    return "v"; // ∨
                } else {
                    return null;
                }
            } else {
                if (startRow > row) {
                    return "^"; // ∧
                } else {
                    return "v"; // ∨
                }
            }
        }

        drag(startRow: number, startColumn: number, row: number, column: number): void {
            this.modifiedCells.forEach(cell => {
                this.grid.switchCell(cell);
            });

            const minRow = Math.min(startRow, row);
            const maxRow = Math.max(startRow, row);
            const minColumn = Math.min(startColumn, column);
            const maxColumn = Math.max(startColumn, column);
            const arrowDirection = this.arrowDirection(startRow, startColumn, row, column);

            // start point
            this.alterCell(startRow, startColumn, "+");

            // horizontal edge
            for (let i = minColumn + 1; i < maxColumn; i++) {
                this.alterCell(startRow, i, "-");
            }

            // horizontal arrow
            if (minRow == maxRow && arrowDirection) {
                this.alterCell(startRow, column, arrowDirection);
            }

            // vertical arrow
            if (minColumn == maxColumn) {
                for (let i = minRow + 1; i < maxRow; i++) {
                    this.alterCell(i, startColumn, "|");
                }
                if (arrowDirection) {
                    this.alterCell(row, startColumn, arrowDirection);
                }
            }

            if (minColumn != maxColumn && minRow != maxRow) {
                for (let i = minRow + 1; i < maxRow; i++) {
                    this.alterCell(i, column, "|");
                }
                // horizontal corner
                this.alterCell(startRow, column, "+");
                if (arrowDirection) {
                    this.alterCell(row, column, arrowDirection);
                }
            }
        }

        end(row: number, column: number): void {
            this.modifiedCells.forEach(cell => {
                this.grid.unselectCell(cell.row, cell.column);
            });
            this.modifiedCells.clear();
        }

        keyDown(key: string): void {
        }
    }
}

