import Grid from './drawers/grid'
import {ToolService} from "./tools/tool-service";
import Constants from "./constants";
import {CellDrawer} from "./drawers/cell-drawer";
import {CanvasGridDrawer, GridDrawer} from "./drawers/grid-drawer";
import {LayerService} from "./layer-service";
import {Shape} from "./shapes/shape";
import {ShapeIdService} from "./shapes/shape-id-service";
import {GridDrawerFactory} from "./drawers/drawer-factory";
import {StateProvider} from "./ui/state-provider";
import Has2DContext from "./has-2d-context";
import DiagToSvgProvider from "./ui/diag-to-svg-provider";
import {Tool, ToolChangedListener} from "./tools/tool";
import {ShapeUpdateEvent, ShapeUpdateListener} from "./shape-update-notification-service";

export default class AsciiDiag implements Has2DContext, ToolChangedListener, ShapeUpdateListener {
    readonly canvasRef: React.RefObject<HTMLCanvasElement>;
    private paint: boolean;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];
    private readonly gridDrawer: GridDrawer;
    private readonly cellDrawer: CellDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private lastPress: [number, number] = [-1, -1];
    private readonly shapeIdService: ShapeIdService;
    private readonly diagToSvgProvider: DiagToSvgProvider;
    private readonly gridDrawerFactory: GridDrawerFactory;
    private readonly appState: StateProvider;
    private readonly gridUpdated: (grid: Grid) => void;

    constructor(canvas: React.RefObject<HTMLCanvasElement>, layerService: LayerService, gridDrawerFactory: GridDrawerFactory,
                diagToSvgProvider: DiagToSvgProvider, cellDrawer: CellDrawer, toolService: ToolService,
                appState: StateProvider, gridUpdated: (grid: Grid) => void) {
        this.diagToSvgProvider = diagToSvgProvider;
        this.canvasRef = canvas;
        this.gridDrawerFactory = gridDrawerFactory;
        this.paint = false;
        this.shapeIdService = new ShapeIdService();
        this.layerService = layerService;
        this.cellDrawer = cellDrawer;
        this.gridDrawer = new CanvasGridDrawer(this.cellDrawer);
        this.toolService = toolService;
        this.appState = appState;
        this.toolService.registerToolChangedListener(this);
        this.gridUpdated = gridUpdated;
        this.redraw();
        this.createUserEvents(appState);
    }

    private createUserEvents(appState: StateProvider) {
        this.getCanvas().addEventListener("mousedown", this.pressEventHandler);
        this.getCanvas().addEventListener("mousemove", this.dragEventHandler);
        this.getCanvas().addEventListener("mouseup", this.releaseEventHandler);
        this.getCanvas().addEventListener("mouseout", this.cancelEventHandler);

        this.getCanvas().addEventListener("touchstart", this.pressEventHandler);
        this.getCanvas().addEventListener("touchmove", this.dragEventHandler);
        this.getCanvas().addEventListener("touchend", this.releaseEventHandler);
        this.getCanvas().addEventListener("touchcancel", this.cancelEventHandler);

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.toolService.currentTool().keyDown(e.key, appState.get());
            this.redraw();
        });
    }

    private redraw() {
        let context = this.getContext();

        context.clearRect(0, 0, Constants.canvasWidth, Constants.canvasHeight);
        const grid = Grid.create(Constants.numberOfRows, Constants.numberOfColumns);
        this.addShapesToGrid(grid);
        this.gridDrawer.draw(grid);
        this.gridUpdated(grid);

        this.toolService.currentTool().render();
        this.diagToSvgProvider.get().render();
    };

    private addShapesToGrid(grid: Grid) {
        this.layerService.shapes.forEach((shape: Shape) => {
            if (!shape.editing()) {
                const drawer = this.gridDrawerFactory.create(shape, grid);
                drawer.draw(shape);
            }
        });
    }

    private addClick(x: number, y: number, dragging: boolean) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    };

    private releaseEventHandler = (e: MouseEvent | TouchEvent) => {
        let [mouseX, mouseY] = this.mousePosition(e);
        let [row, column] = this.fromCanvasToGrid(mouseX, mouseY);
        this.toolService.currentTool().mouseUp(row, column, this.appState.get());

        this.lastPress = [-1, -1];
        this.paint = false;
        this.redraw();
    };

    private mousePosition(e: MouseEvent | TouchEvent): [number, number] {
        let mouseX = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageX :
            (e as MouseEvent).pageX;
        let mouseY = (e as TouchEvent).changedTouches ?
            (e as TouchEvent).changedTouches[0].pageY :
            (e as MouseEvent).pageY;
        mouseX -= this.getCanvas().offsetLeft;
        mouseY -= this.getCanvas().offsetTop;
        return [mouseX, mouseY];
    }

    private cancelEventHandler = () => {
        this.paint = false;
    };

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        let [mouseX, mouseY] = this.mousePosition(e);
        this.lastPress = this.fromCanvasToGrid(mouseX, mouseY);
        let [row, column] = this.fromCanvasToGrid(mouseX, mouseY);
        this.toolService.currentTool().mouseDown(row, column, mouseX, mouseY, this.appState.get());

        this.paint = true;
        this.addClick(mouseX, mouseY, false);
        this.redraw();
    };

    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        const [mouseX, mouseY] = this.mousePosition(e);
        const [row, column] = this.fromCanvasToGrid(mouseX, mouseY);

        document.body.style.cursor = 'default';
        if (this.lastPress[0] != -1) {
            const [startRow, startColumn] = this.lastPress;
            this.toolService.currentTool().drag(startRow, startColumn, row, column, mouseX, mouseY, this.appState.get());
        } else {
            this.toolService.currentTool().mouseMove(row, column, mouseX, mouseY, this.appState.get());
        }

        this.redraw();

        if (this.paint) {
            this.addClick(mouseX, mouseY, true);
            this.redraw();
        }

        e.preventDefault();
    };

    private fromCanvasToGrid(x: number, y: number): [number, number] {
        return [Math.floor(y / Constants.densityY), Math.floor(x / Constants.densityX)];
    }

    getContext(): CanvasRenderingContext2D {
        return this.canvasRef.current!.getContext("2d")!;
    }

    getCanvas(): HTMLCanvasElement {
        return this.canvasRef.current!;
    }

    toolChanged(prevTool: Tool, tool: Tool): void {
        prevTool.beforeToolChange(tool);
        this.redraw();
    }

    update(event: ShapeUpdateEvent, shape: Shape): void {
        this.redraw();
    }
}
