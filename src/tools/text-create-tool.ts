import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Entity} from "../entities/entity";
import {TextEntity} from "../entities/text-entity";
import {EntityIdService} from "../entities/entity-id-service";
import {Text} from "../drawers/text";
import {TextDrawer} from "../drawers/text-drawer";
import {CursorDrawer} from "../drawers/cursor-drawer";
import {Cursor} from "../drawers/cursor";

export class TextCreateTool implements Tool {

    protected readonly layerService: LayerService;
    protected readonly entityIdService: EntityIdService;
    protected readonly textDrawer: TextDrawer;
    protected readonly cursorDrawer: CursorDrawer;

    protected currentText: Text | null = null;

    constructor(layerService: LayerService, entityIdService: EntityIdService, textDrawer: TextDrawer, cursorDrawer: CursorDrawer) {
        this.layerService = layerService;
        this.entityIdService = entityIdService;
        this.textDrawer = textDrawer;
        this.cursorDrawer = cursorDrawer;
        this.currentText = null;
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        if (this.currentText) {
            this.persist();
            this.done();
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

    keyDown(key: string): void {
        console.log("Pressed " + key);

        if (!this.currentText) {
            return;
        }

        if (key === "Enter") {
            console.log("Done");
            this.done();
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

    drag(startRow: number, startColumn: number, row: number, column: number, x: number, y: number): void {
    }

    mouseUp(row: number, column: number): void {
    }

    done(): void {
        this.persist();
        this.currentText = null;
    }

    persist(): void {
        if (!this.currentText) {
            return;
        }
        const entity: Entity = new TextEntity(
            this.entityIdService.nextId(),
            this.currentText!.row,
            this.currentText!.column,
            this.currentText!.text);
        if (this.currentText!.text.length == 0) {
            return;
        }
        this.layerService.createEntity(entity);
    }

    render(): void {
        if (this.currentText) {
            this.textDrawer.draw(this.currentText);
            const cursor = Cursor.fromGrid(this.currentText.row, this.currentText.column + this.currentText.text.length)
            this.cursorDrawer.draw(cursor);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
