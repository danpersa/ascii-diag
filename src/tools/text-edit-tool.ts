import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Shape} from "../shapes/shape";
import {TextShape} from "../shapes/text-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {TextCreateTool} from "./text-create-tool";
import {TextDrawer} from "../drawers/text-drawer";
import {CursorDrawer} from "../drawers/cursor-drawer";
import {Text} from "../drawers/text";
import {Vertex} from "../drawers/vertex";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ToolService} from "./tool-service";
import {CellToShapeService} from "../cell-to-shape-service";
import {AppState} from "../ui/app-state";

export class TextEditTool extends TextCreateTool implements Tool {

    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;
    private readonly cellToShapeService: CellToShapeService;

    private readonly shape: TextShape;
    private moveVertex: Vertex;

    constructor(layerService: LayerService, toolService: ToolService, shapeIdService: ShapeIdService, textDrawer: TextDrawer,
                cursorDrawer: CursorDrawer, vertexDrawer: VertexDrawer, cellToShapeService: CellToShapeService,
                shape: TextShape) {

        super(layerService, shapeIdService, textDrawer, cursorDrawer);
        this.vertexDrawer = vertexDrawer;
        this.toolService = toolService;
        this.cellToShapeService = cellToShapeService;

        this.shape = shape;
        this.currentText = Text.Builder.fromShape(this.shape).build();
        this.moveVertex = Vertex.fromGrid(this.shape.row, this.shape.column);
        this.shape.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        const shape = this.cellToShapeService.getShape(row, column);
        console.log("Shape found: " + shape);

        if (shape && shape instanceof TextShape && shape === this.shape) {
            console.log("Select TextMoveTool");
            this.toolService.selectTextMoveTool(this.shape);
        } else {
            if (this.currentText) {
                this.persist(appState);
            }
            this.toolService.selectShapeFor(row, column);
        }
    }

    private updateMoveVertex() {
        if (this.currentText) {
            this.moveVertex = Vertex.fromGrid(this.shape.row, this.shape.column);
        }
    }

    protected addChar(char: string): void {
        super.addChar(char);
        this.updateMoveVertex();
    }

    protected removeChar(): void {
        super.removeChar();
        this.updateMoveVertex();
    }

    render(): void {
        super.render();
        if (this.currentText) {
            this.vertexDrawer.draw(this.moveVertex);
        }
    }

    persist(): void {
        if (!this.currentText) {
            return;
        }
        const shape: Shape = new TextShape(
            this.shape.id(),
            this.currentText.row,
            this.currentText.column,
            this.currentText.text);

        if (this.currentText.text.length > 0) {
            this.layerService.updateShape(shape);
            this.shape.endEditing();
        } else {
            // we deleted all text, so we delete the shape
            this.layerService.deleteShape(this.shape.id());
        }

        this.currentText = null;
    }

    beforeToolChange(): void {
        this.persist();
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        if (this.moveVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
