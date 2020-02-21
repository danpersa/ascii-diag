import {Tool} from "./tool";
import {ToolService} from "./tool-service";
import {LayerService} from "../layer-service";
import {AppState} from "../ui/app-state";
import {Shape} from "../shapes/shape";

export class ShapeUpdateStylesTool<T extends Shape> implements Tool {

    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly shape: T;
    private done = false;

    constructor(toolService: ToolService,
                layerService: LayerService,
                shape: T) {
        this.toolService = toolService;
        this.shape = shape;
        this.layerService = layerService;
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    render() {
        if (this.done) {
            return
        }
        this.done = true;

        this.layerService.updateShape(this.shape);
        this.toolService.selectShapeEditTool(this.shape);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
    }

    beforeToolChange(tool: Tool): void {
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
