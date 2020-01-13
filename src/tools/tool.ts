export enum Tools {
    select = "select",
    text = "text",
    box = "box",
    arrow = "arrow",
}


export interface Tool {

    mouseDown(row: number, column: number, x: number, y: number): void;

    mouseMove(row: number, column: number, x: number, y: number): void;

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void;

    keyDown(key: string): void;

    mouseUp(row: number, column: number): void;

    persist(): void;

    render(): void;
}
