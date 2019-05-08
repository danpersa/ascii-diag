export interface Tool {

    clickDown(row: number, column: number): void;

    drag(startRow: number, startColumn: number, row: number, column: number): void;

    keyDown(key: string): void;

    endDrag(row: number, column: number): void;

    persist(): void;
}
