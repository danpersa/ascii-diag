import {Tool} from "./tool";
import {ToolService} from "./tool-service";

export class SelectTool implements Tool {

    private readonly toolService: ToolService;

    constructor(toolService: ToolService) {
        this.toolService = toolService;
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        console.log("Select tool click on row: " + row + " column=" + column);
        this.toolService.selectShapeFor(row, column);
    }

    render() {
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
    }

    mouseUp(row: number, column: number): void {
    }

    keyDown(key: string): void {
    }

    persist(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
