import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Entity} from "../entities/entity";
import {TextEntity} from "../entities/text-entity";
import {EntityIdService} from "../entities/entity-id-service";
import {Text} from "../text";
import {TextDrawer} from "../text-drawer";
import {CursorDrawer} from "../cursor-drawer";

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
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        if (this.currentText) {
            this.persist();
            this.done();
        } else {
            this.currentText = new Text(row, column, "");
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
            this.persist();
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
        this.currentText = null;
    }

    persist(): void {
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
            this.cursorDrawer.draw(this.currentText.row, this.currentText.column + this.currentText.text.length);
        }
    }

    mouseMove(row: number, column: number, x: number, y: number): void {
    }
}
