import Cell = Domain.Cell;

type CellMatrix = Array<Array<Cell>>;

class Grid {

    private readonly cellMatrix: CellMatrix;

    constructor() {
        this.cellMatrix = [];
        console.log("Init grid: numberOfRows: " + Constants.numberOfRows + " numberOfColumns: " + Constants.numberOfColumns);
        for (let row = 0; row <= Constants.numberOfRows; row++) {
            this.cellMatrix.push([]);
            for (let column = 0; column <= Constants.numberOfColumns; column++) {
                const cell = Cell.Builder.from(row, column).build();
                this.cellMatrix[row].push(cell);
            }
        }
    }

    cell(row: number, column: number): Cell {
        return this.cellMatrix[row][column];
    }

    switchCell(cell: Cell) {
        this.cellMatrix[cell.row][cell.column] = cell;
    }

    selectCell(row: number, column: number) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Cell.Builder.fromCell(currentCell).selected(true).build();
        this.cellMatrix[row][column] = newCell;
    }

    valueCell(row: number, column: number, value: string) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Cell.Builder.fromCell(currentCell).value(value).build();
        this.cellMatrix[row][column] = newCell;
    }

    unselectCell(row: number, column: number) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Cell.Builder.fromCell(currentCell).selected(false).build();
        this.cellMatrix[row][column] = newCell;
    }
}
