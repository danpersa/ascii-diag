import {Tool} from "./tool";
import {EntitySelectionService} from "./entity-selection-service";

export class SelectTool implements Tool {

    private readonly entitySelectionService: EntitySelectionService;

    constructor(entitySelectionService: EntitySelectionService) {
        this.entitySelectionService = entitySelectionService;
    }

    mouseDown(row: number, column: number, x: number, y: number): boolean {
        console.log("Select tool click on row: " + row + " column=" + column);
        this.entitySelectionService.selectEntityFor(row, column);
        return true;
    }

    render() {
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): boolean {
        return true;
    }

    mouseUp(row: number, column: number): boolean {
        return false;
    }

    keyDown(key: string): boolean {
        return true;
    }

    persist(): void {
    }

    done(): void {
    }

    mouseMove(row: number, column: number, x: number, y: number): boolean {
        return true;
    }
}
