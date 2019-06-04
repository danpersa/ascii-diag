import Grid from './grid'
import {ToolService} from "./tools/tool-service";
import Constants from "./constants";
import {CellDrawer} from "./cell-drawer";
import {GridDrawer} from "./grid-drawer";
import {LayerService} from "./layer-service";
import {SelectBoxDrawer} from "./select-box-drawer";
import {VertexDrawer} from "./vertex-drawer";
import {BoxDrawer} from "./box-drawer";
import {Entity} from "./entities/entity";
import {EntityIdService} from "./entities/entity-id-service";
import {TextDrawer} from "./text-drawer";
import {CursorDrawer} from "./cursor-drawer";
import {ArrowDrawer} from "./arrow-drawer";
import {DiagToSvg} from "./svg/diag-to-svg";

class AsciiDiag {
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
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly vertexDrawer: VertexDrawer;
    private readonly boxDrawer: BoxDrawer;
    private readonly entityIdService: EntityIdService;
    private readonly arrowDrawer: ArrowDrawer;
    private readonly diagToSvg: DiagToSvg;

    constructor() {
        let canvas = document.getElementById('canvas') as
            HTMLCanvasElement;
        let context = canvas.getContext("2d")!;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 1;

        this.canvas = canvas;
        this.context = context;
        this.paint = false;
        this.grid = new Grid();
        this.entityIdService = new EntityIdService();
        this.layerService = new LayerService(this.grid);
        this.cellDrawer = new CellDrawer(context, this.grid);
        this.gridDrawer = new GridDrawer(this.grid, this.cellDrawer);
        this.vertexDrawer = new VertexDrawer(context);
        this.selectBoxDrawer = new SelectBoxDrawer(context, this.vertexDrawer);
        this.boxDrawer = new BoxDrawer(this.cellDrawer);
        this.arrowDrawer = new ArrowDrawer(this.cellDrawer);
        const textDrawer = new TextDrawer(this.cellDrawer);
        const cursorDrawer = new CursorDrawer(context);

        this.toolService = new ToolService(this.grid, this.layerService, this.selectBoxDrawer, this.boxDrawer,
            this.entityIdService, textDrawer, cursorDrawer, this.vertexDrawer, this.arrowDrawer);

        this.diagToSvg = new DiagToSvg(this.layerService);

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

        document.getElementById('box')!
            .addEventListener("click", this.boxToolEventHandler);
        document.getElementById('arrow')!
            .addEventListener("click", this.arrowToolEventHandler);
        document.getElementById('tx')!
            .addEventListener("click", this.textToolEventHandler);
        document.getElementById('select')!
            .addEventListener("click", this.selectToolEventHandler);

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

    private boxToolEventHandler = () => {
        this.toolService.selectBoxTool();
    };

    private arrowToolEventHandler = () => {
        this.toolService.selectArrowTool();
    };

    private textToolEventHandler = () => {
        this.toolService.selectTextTool();
    };

    private selectToolEventHandler = () => {
        this.toolService.selectSelectTool();
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

new AsciiDiag();
