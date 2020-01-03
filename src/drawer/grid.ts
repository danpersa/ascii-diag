import Constants from '../constants'
import {Domain} from './cell'

type CellMatrix = Array<Array<Domain.Cell>>;

export default class Grid {

    private readonly cellMatrix: CellMatrix;

    constructor() {
        this.cellMatrix = [];
        this.init();
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

    valueCell(row: number, column: number, value: string) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Domain.Cell.Builder.fromCell(currentCell).value(value).build();
        this.cellMatrix[row][column] = newCell;
    }

    unselectCell(row: number, column: number) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Domain.Cell.Builder.fromCell(currentCell).selected(false).build();
        this.cellMatrix[row][column] = newCell;
    }

    private init(): void {
        // console.log("Init grid: numberOfRows: " + Constants.numberOfRows + " numberOfColumns: " + Constants.numberOfColumns);
        // this is called too many times, should be optimized
        for (let row = 0; row <= Constants.numberOfRows; row++) {
            this.cellMatrix.push([]);
            for (let column = 0; column <= Constants.numberOfColumns; column++) {
                const cell = Domain.Cell.Builder.from(row, column).build();
                this.cellMatrix[row].push(cell);
            }
        }
    }

    reset(): void {
        this.cellMatrix.length = 0;
        this.init();
    }
}
