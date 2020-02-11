import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {AppState} from "../ui/app-state";

export class SelectTool implements Tool {

    private readonly toolService: ToolService;

    constructor(toolService: ToolService) {
        this.toolService = toolService;
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        console.log("Select tool click on row: " + row + " column=" + column);
        this.toolService.selectShapeFor(row, column);
    }

    render() {
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    persist(appState: Readonly<AppState>): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
