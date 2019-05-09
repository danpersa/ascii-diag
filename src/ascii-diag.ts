import Grid from './grid'
import {ToolService} from "./tools/tool-service";
import Constants from "./constants";
import {CellDrawer} from "./cell-drawer";
import {GridDrawer} from "./grid-drawer";
import {LayerService} from "./layer-service";
import {Editor} from "./editors/editor";
import {BoxEditor} from "./editors/box-editor";
import {BoxEntity} from "./entities/box-entity";
import {SelectBoxDrawer} from "./select-box-drawer";
import {VertexDrawer} from "./vertex-drawer";
import {EditorService} from "./editors/editor-service";


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
    private readonly editor: Editor;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly vertexDrawer: VertexDrawer;
    private readonly editorService: EditorService;

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
        this.layerService = new LayerService(this.grid);
        this.cellDrawer = new CellDrawer(context, this.grid);
        this.gridDrawer = new GridDrawer(this.grid, this.cellDrawer);
        this.vertexDrawer = new VertexDrawer(context);
        this.selectBoxDrawer = new SelectBoxDrawer(context, this.vertexDrawer);
        this.editorService = new EditorService(this.selectBoxDrawer);
        this.toolService = new ToolService(this.grid, this.layerService, this.selectBoxDrawer, this.editorService);

        const boxEntity = new BoxEntity(10, 10, 20, 20);
        this.editor = new BoxEditor(boxEntity, this.selectBoxDrawer);

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

        document.getElementById('clear')!
            .addEventListener("click", this.clearEventHandler);
        document.getElementById('box')!
            .addEventListener("click", this.boxToolEventHandler);
        document.getElementById('box-edit')!
            .addEventListener("click", this.boxEditToolEventHandler);
        document.getElementById('arrow')!
            .addEventListener("click", this.arrowToolEventHandler);
        document.getElementById('tx')!
            .addEventListener("click", this.textToolEventHandler);


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

        for (let i = 0; i < clickX.length; ++i) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }

            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
        context.closePath();
        this.gridDrawer.draw();
        this.editor.draw();


        this.toolService.currentTool().renderEditor();
    };

    private addClick(x: number, y: number, dragging: boolean) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    };

    private clearCanvas() {
        this.context
            .clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
    };

    private clearEventHandler = () => {
        this.clearCanvas();
    };

    private boxToolEventHandler = () => {
        this.toolService.selectBoxTool();
    };

    private boxEditToolEventHandler = () => {
        this.toolService.selectBoxEditTool();
    };

    private arrowToolEventHandler = () => {
        this.toolService.selectArrowTool();
    };

    private textToolEventHandler = () => {
        this.toolService.selectTextTool();
    };

    private releaseEventHandler = (e: MouseEvent | TouchEvent) => {
        let [mouseX, mouseY] = this.mousePosition(e);
        let [row, column] = this.fromCanvasToGrid(mouseX, mouseY);
        this.toolService.currentTool().endDrag(row, column);

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
        this.toolService.currentTool().mouseDown(row, column);

        this.paint = true;
        this.addClick(mouseX, mouseY, false);
        this.redraw();


    };

    private dragEventHandler = (e: MouseEvent | TouchEvent) => {
        let [mouseX, mouseY] = this.mousePosition(e);
        let [row, column] = this.fromCanvasToGrid(mouseX, mouseY);
        // console.log("Mouse X: " + mouseX, " Y: " + mouseY + " Row: " + row, " Column: " + column);


        if (this.lastPress[0] != -1) {
            const [startRow, startColumn] = this.lastPress;
            this.toolService.currentTool().drag(startRow, startColumn, row, column);
        }

        document.body.style.cursor = 'default';
        this.redraw();
        const currentEditor = this.editorService.currentEditor();
        if (currentEditor) {
            currentEditor.mouseMove(mouseX, mouseY);
        }

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
