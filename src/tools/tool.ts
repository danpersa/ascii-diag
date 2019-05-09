export interface Tool {

    mouseDown(row: number, column: number): void;

    drag(startRow: number, startColumn: number, row: number, column: number): void;

    keyDown(key: string): void;

    endDrag(row: number, column: number): void;

    persist(): void;

    renderEditor(): void;
}
