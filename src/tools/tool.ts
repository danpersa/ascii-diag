export interface Tool {

    mouseDown(row: number, column: number, x: number, y: number): boolean;

    mouseMove(row: number, column: number, x: number, y: number): boolean;

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean;

    keyDown(key: string): boolean;

    mouseUp(row: number, column: number): boolean;

    persist(): void;

    done(): void;

    render(): void;
}
