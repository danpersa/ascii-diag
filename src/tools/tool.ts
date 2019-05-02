namespace Tools {
    export interface Tool {


        start(row: number, column: number): void;

        drag(startRow: number, startColumn: number, row: number, column: number): void;

        keyDown(key: string): void;

        end(row: number, column: number): void;
    }
}