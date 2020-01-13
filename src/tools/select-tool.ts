import {Tool} from "./tool";
import {ShapeSelectionService} from "./shape-selection-service";

export class SelectTool implements Tool {

    private readonly shapeSelectionService: ShapeSelectionService;

    constructor(shapeSelectionService: ShapeSelectionService) {
        this.shapeSelectionService = shapeSelectionService;
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        console.log("Select tool click on row: " + row + " column=" + column);
        this.shapeSelectionService.selectShapeFor(row, column);
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
