import {Domain} from './cell'

type CellMatrix = Array<Array<Domain.Cell>>;

export default class Grid {

    private readonly cellMatrix: CellMatrix;

    static create(rows: number, columns: number): Grid {
        const cellMatrix: CellMatrix = [];
        for (let row = 0; row < rows; row++) {
            cellMatrix.push([]);
            for (let column = 0; column < columns; column++) {
                const cell = Domain.Cell.Builder.from(row, column).build();
                cellMatrix[row].push(cell);
            }
        }
        return new Grid(cellMatrix);
    }

    private constructor(cellMatrix: CellMatrix) {
        this.cellMatrix = cellMatrix;
    }

    cell(row: number, column: number): Domain.Cell {
        return this.cellMatrix[row][column];
    }

    switchCell(cell: Domain.Cell) {
        this.cellMatrix[cell.row][cell.column] = cell;
    }

    selectCell(row: number, column: number) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Domain.Cell.Builder.fromCell(currentCell).selected(true).build();
        this.cellMatrix[row][column] = newCell;
    }

    setTextForCell(row: number, column: number, value: string) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Domain.Cell.Builder.fromCell(currentCell).text(value).build();
        this.cellMatrix[row][column] = newCell;
    }

    unselectCell(row: number, column: number) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Domain.Cell.Builder.fromCell(currentCell).selected(false).build();
        this.cellMatrix[row][column] = newCell;
    }

    rows(): number {
        return this.cellMatrix.length;
    }

    columns(): number {
        return this.cellMatrix[0].length;
    }
}
