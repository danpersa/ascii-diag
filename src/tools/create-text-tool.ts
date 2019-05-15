import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Entity} from "../entities/entity";
import {TextEntity} from "../entities/text-entity";
import {EntityIdService} from "../entities/entity-id-service";
import {Text} from "../text";
import {TextDrawer} from "../text-drawer";
import {CursorDrawer} from "../cursor-drawer";

export class CreateTextTool implements Tool {

    private readonly layerService: LayerService;
    private readonly entityIdService: EntityIdService;
    private readonly textDrawer: TextDrawer;
    private readonly cursorDrawer: CursorDrawer;

    private currentText: Text | null = null;

    constructor(layerService: LayerService, entityIdService: EntityIdService, textDrawer: TextDrawer, cursorDrawer: CursorDrawer) {
        this.layerService = layerService;
        this.entityIdService = entityIdService;
        this.textDrawer = textDrawer;
        this.cursorDrawer = cursorDrawer;
    }

    // init(entity: TextEntity) {
    //     entity.cells().forEach(cell => {
    //         this.grid.selectCell(cell.row, cell.column);
    //     });
    //     this.startCell = this.grid.cell(entity.row, entity.column);
    //     this.currentCell = this.grid.cell(entity.row, entity.column + entity.text.length);
    //     this.currentText = entity.text;
    // }

    mouseDown(row: number, column: number, x: number, y: number): void {
        const entity = this.layerService.getEntity(row, column);
        console.log("Entity found: " + entity);
        //this.done();

        // if (entity && entity instanceof TextEntity) {
        //     this.init(entity);
        //     return;
        // }
        if (this.currentText) {
            this.persist();
            this.done();
        } else {
            this.currentText = new Text(row, column, "");
        }

        return;
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
            if (this.currentText.text.length != 0) {
                this.currentText.removeChar();
            }
            return;
        }

        if (key.length > 1) {
            return;
        }

        this.currentText.addChar(key);
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
