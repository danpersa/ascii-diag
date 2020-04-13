import {Cell} from "./cell";

type CellMatrix = Array<Array<Cell>>;

export class Grid {

    private readonly cellMatrix: CellMatrix;

    static create(rows: number, columns: number): Grid {
        const cellMatrix: CellMatrix = [];
        for (let row = 0; row < rows; row++) {
            cellMatrix.push([]);
            for (let column = 0; column < columns; column++) {
                const cell = Cell.Builder.from(row, column).build();
                cellMatrix[row].push(cell);
            }
        }
        return new Grid(cellMatrix);
    }

    static fromString(s: String): Grid {
        const cellMatrix: CellMatrix = [];
        let row = 0;
        let column = 0;
        let numberOfColumns = this.longestLine(s);
        cellMatrix.push([]);
        for (let currentCharIndex = 0; currentCharIndex < s.length; ++currentCharIndex) {
            let currentChar = s[currentCharIndex];
            if (currentChar == '\n' || currentCharIndex == s.length - 1) {
                // add missing columns
                while (column < numberOfColumns) {
                    let cell = Cell.Builder.from(row, column++).text('').build();
                    cellMatrix[row].push(cell);
                }
                if (currentCharIndex == s.length - 1) {
                    break;
                }
                cellMatrix.push([]);
                row++;
                column = 0;
            } else {
                let cell = Cell.Builder.from(row, column++)
                    .text(currentChar.replace(/\s/g, ""))
                    .build();
                cellMatrix[row].push(cell);
            }
        }

        return new Grid(cellMatrix);
    }

    private static longestLine(s: String): number {
        return s.split('\n')
            .map(line => line.length)
            .reduce(((previousValue, currentValue) =>
                previousValue > currentValue ? previousValue : currentValue));

    }

    private constructor(cellMatrix: CellMatrix) {
        this.cellMatrix = cellMatrix;
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

    setTextForCell(row: number, column: number, value: string) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Cell.Builder.fromCell(currentCell).text(value).build();
        this.cellMatrix[row][column] = newCell;
    }

    unselectCell(row: number, column: number) {
        const currentCell = this.cellMatrix[row][column];
        const newCell = Cell.Builder.fromCell(currentCell).selected(false).build();
        this.cellMatrix[row][column] = newCell;
    }

    rows(): number {
        return this.cellMatrix.length;
    }

    columns(): number {
        return this.cellMatrix[0].length;
    }

    toMarkup(): string {
        let result = "";
        for (let row = 0; row < this.cellMatrix.length; row++) {
            for (let column = 0; column < this.cellMatrix[row].length; column++) {
                const cell = this.cellMatrix[row][column];
                if (cell.text) {
                    result += cell.text;
                } else {
                    result += " ";
                }
            }
            result += '\n';
        }
        result += '\n';
        return result;
    }

    difference(gridWithBoxes: Grid) {
        const diffGrid = Grid.create(this.rows(), this.columns());
        for (let row = 0; row < this.cellMatrix.length; row++) {
            for (let column = 0; column < this.cellMatrix[row].length; column++) {
                const cell = this.cellMatrix[row][column];
                if (cell.text &&
                    ((gridWithBoxes.cell(row, column).text && cell.text !== gridWithBoxes.cell(row, column).text) ||
                        !gridWithBoxes.cell(row, column).text)) {
                    diffGrid.switchCell(cell);
                }
            }
        }
        return diffGrid;
    }
}
