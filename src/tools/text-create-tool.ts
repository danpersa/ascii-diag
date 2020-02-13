import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Shape} from "../shapes/shape";
import {TextShape} from "../shapes/text-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {Text} from "../drawers/text";
import {TextDrawer} from "../drawers/text-drawer";
import {CursorDrawer} from "../drawers/cursor-drawer";
import {Cursor} from "../drawers/cursor";
import {AppState} from "../ui/app-state";

export class TextCreateTool implements Tool {

    protected readonly layerService: LayerService;
    protected readonly shapeIdService: ShapeIdService;
    protected readonly textDrawer: TextDrawer;
    protected readonly cursorDrawer: CursorDrawer;

    protected currentText: Text | null = null;

    constructor(layerService: LayerService, shapeIdService: ShapeIdService, textDrawer: TextDrawer, cursorDrawer: CursorDrawer) {
        this.layerService = layerService;
        this.shapeIdService = shapeIdService;
        this.textDrawer = textDrawer;
        this.cursorDrawer = cursorDrawer;
        this.currentText = null;
    }

    mouseDown(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
        if (this.currentText) {
            this.persist();
        } else {
            this.currentText = Text.fromGrid(row, column, "");
        }
    }

    protected addChar(char: string): void {
        this.currentText!.addChar(char);
    }

    protected removeChar(): void {
        if (this.currentText && this.currentText.text.length != 0) {
            this.currentText.removeChar();
        }
    }

    keyDown(key: string, appState: Readonly<AppState>): void {
        console.log("Pressed " + key);

        if (!this.currentText) {
            return;
        }

        if (key === "Enter") {
            console.log("Persist text");
            this.persist();
            return;
        }

        if (key === "Backspace") {
            this.removeChar();
            return;
        }

        if (key.length > 1) {
            return;
        }
        this.addChar(key);
    }

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }

    mouseUp(row: number, column: number, appState: Readonly<AppState>): void {
    }

    persist(): void {
        if (!this.currentText) {
            this.currentText = null;
            return;
        }
        if (this.currentText!.text.length == 0) {
            this.currentText = null;
            return;
        }
        const shape: Shape = new TextShape(
            this.shapeIdService.nextId(),
            this.currentText!.row,
            this.currentText!.column,
            this.currentText!.text);

        this.layerService.createShape(shape);
        this.currentText = null;
    }

    render(): void {
        if (this.currentText) {
            this.textDrawer.draw(this.currentText);
            const cursor = Cursor.fromGrid(this.currentText.row, this.currentText.column + this.currentText.text.length)
            this.cursorDrawer.draw(cursor);
        }
    }

    beforeToolChange(tool: Tool): void {
        this.persist();
    }

    mouseMove(row: number, column: number, x: number, y: number, appState: Readonly<AppState>): void {
    }
}
