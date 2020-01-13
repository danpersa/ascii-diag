import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Shape} from "../shapes/shape";
import {TextShape} from "../shapes/text-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {TextCreateTool} from "./text-create-tool";
import {TextDrawer} from "../drawers/text-drawer";
import {CursorDrawer} from "../drawers/cursor-drawer";
import {Text} from "../drawers/text";
import {ShapeSelectionService} from "./shape-selection-service";
import {Vertex} from "../drawers/vertex";
import {VertexDrawer} from "../drawers/vertex-drawer";
import {ToolService} from "./tool-service";

export class TextEditTool extends TextCreateTool implements Tool {

    private readonly shapeSelectionService: ShapeSelectionService;
    private readonly vertexDrawer: VertexDrawer;
    private readonly toolService: ToolService;

    private readonly shape: TextShape;
    private moveVertex: Vertex;

    constructor(layerService: LayerService, toolService: ToolService, shapeIdService: ShapeIdService, textDrawer: TextDrawer,
                cursorDrawer: CursorDrawer, vertexDrawer: VertexDrawer, shapeSelectionService: ShapeSelectionService,
                shape: TextShape) {

        super(layerService, shapeIdService, textDrawer, cursorDrawer);
        this.shapeSelectionService = shapeSelectionService;
        this.vertexDrawer = vertexDrawer;
        this.toolService = toolService;

        this.shape = shape;
        this.currentText = Text.fromGrid(this.shape.row, this.shape.column, this.shape.text);
        this.moveVertex = Vertex.fromGrid(this.shape.row, this.shape.column);
        this.shape.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        const shape = this.layerService.getShape(row, column);
        console.log("Shape found: " + shape);

        if (shape && shape instanceof TextShape && shape === this.shape) {
            console.log("Select TextMoveTool");
            this.toolService.selectTextMoveTool(this.shape);
        } else {
            if (this.currentText) {
                this.persist();
            }
            this.shapeSelectionService.selectShapeFor(row, column);
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
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
        if (this.moveVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'move';
        }
    }
}
