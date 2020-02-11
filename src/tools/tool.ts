import {AppState} from "../ui/app-state";

export enum Tools {
    select = "select",
    text = "text",
    box = "box",
    connector = "connector",
}

export interface ToolChangedListener {
    toolUpdated(newTool: Tool): void;
}

export interface Tool {

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void;

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void;

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void;

    keyDown(key: string, appState: Readonly<AppState>): void;

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void;

    persist(appState: Readonly<AppState>): void;

    render(): void;
}
