import Grid from './grid'
import {ToolService} from "./tools/tool-service";
import Constants from "./constants";
import {CellDrawer} from "./cell-drawer";
import {GridDrawer} from "./grid-drawer";
import {LayerService} from "./layer-service";
import {Entity} from "./entities/entity";
import {EntityIdService} from "./entities/entity-id-service";
import {DiagToSvg} from "./svg/diag-to-svg";

export default class AsciiDiag {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private paint: boolean;

    private clickX: number[] = [];
    private clickY: number[] = [];
    private clickDrag: boolean[] = [];
    private readonly grid: Grid;
    private readonly gridDrawer: GridDrawer;
    private readonly cellDrawer: CellDrawer;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private lastPress: [number, number] = [-1, -1];
    private readonly entityIdService: EntityIdService;
    private readonly diagToSvg: DiagToSvg;

    constructor(canvas: HTMLCanvasElement, grid: Grid, layerService: LayerService, diagToSvg: DiagToSvg, cellDrawer: CellDrawer, toolService: ToolService, context: CanvasRenderingContext2D) {
        this.diagToSvg = diagToSvg;
        this.canvas = canvas;
        this.context = context;
        this.paint = false;
        this.grid = grid;
        this.entityIdService = new EntityIdService();
        this.layerService = layerService;
        this.cellDrawer = cellDrawer;
        this.gridDrawer = new GridDrawer(this.grid, this.cellDrawer);
        this.toolService = toolService;

        this.redraw();
        this.createUserEvents();
        console.log("Selected tool: " + this.selectedTool());
    }

    private createUserEvents() {
        let canvas = this.canvas;

        canvas.addEventListener("mousedown", this.pressEventHandler);
        canvas.addEventListener("mousemove", this.dragEventHandler);
        canvas.addEventListener("mouseup", this.releaseEventHandler);
        canvas.addEventListener("mouseout", this.cancelEventHandler);

        canvas.addEventListener("touchstart", this.pressEventHandler);
        canvas.addEventListener("touchmove", this.dragEventHandler);
        canvas.addEventListener("touchend", this.releaseEventHandler);
        canvas.addEventListener("touchcancel", this.cancelEventHandler);

        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.toolService.currentTool().keyDown(e.key);
            this.redraw();
        });
    }

    private redraw() {
        let clickX = this.clickX;
        let context = this.context;
        let clickDrag = this.clickDrag;
        let clickY = this.clickY;

        context.clearRect(0, 0, Constants.canvasWidth, Constants.canvasHeight);
        this.grid.reset();
        this.addEntitiesToGrid();
        this.gridDrawer.draw();

        this.toolService.currentTool().render();
        this.diagToSvg.render();
    };

    private addEntitiesToGrid() {
        this.layerService.entities.forEach((entity: Entity) => {
            if (!entity.editing()) {
                entity.cells().forEach(cell => {
                    this.grid.valueCell(cell.row, cell.column, cell.value);
                })
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
        this.toolService.currentTool().mouseUp(row, column);

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
        mouseX -= this.canvas.offsetLeft;
        mouseY -= this.canvas.offsetTop;
        return [mouseX, mouseY];
    }

    private cancelEventHandler = () => {
        this.paint = false;
    };

    private pressEventHandler = (e: MouseEvent | TouchEvent) => {
        let [mouseX, mouseY] = this.mousePosition(e);
        this.lastPress = this.fromCanvasToGrid(mouseX, mouseY);
        let [row, column] = this.fromCanvasToGrid(mouseX, mouseY);
        this.toolService.currentTool().mouseDown(row, column, mouseX, mouseY);

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
            this.toolService.currentTool().drag(startRow, startColumn, row, column, mouseX, mouseY);
        } else {
            this.toolService.currentTool().mouseMove(row, column, mouseX, mouseY);
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

    private selectedTool(): string {
        const buttons: Array<HTMLElement> = [];
        document.getElementsByName("tool").forEach((value) => {
            buttons.push(value);
        });
        const selected = buttons.filter(value => value.getAttribute("checked")).pop();
        if (selected) {
            return selected.getAttribute("value")!;
        } else {
            return "none";
        }
    }
}
