import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {Entity} from "../entities/entity";
import {TextEntity} from "../entities/text-entity";
import {EntityIdService} from "../entities/entity-id-service";
import {TextCreateTool} from "./text-create-tool";
import {TextDrawer} from "../text-drawer";
import {CursorDrawer} from "../cursor-drawer";
import {Text} from "../text";
import {EntitySelectionService} from "./entity-selection-service";

export class TextEditTool extends TextCreateTool implements Tool {

    private readonly currentEntity: TextEntity;
    private readonly entitySelectionService: EntitySelectionService;

    constructor(layerService: LayerService, entityIdService: EntityIdService, textDrawer: TextDrawer, cursorDrawer: CursorDrawer, entitySelectionService: EntitySelectionService, entity: TextEntity) {
        super(layerService, entityIdService, textDrawer, cursorDrawer);
        this.entitySelectionService = entitySelectionService;
        this.currentEntity = entity;
        this.currentText = new Text(this.currentEntity.row, this.currentEntity.column, this.currentEntity.text);
        this.currentEntity.startEditing();
    }

    mouseDown(row: number, column: number, x: number, y: number): void {
        const entity = this.layerService.getEntity(row, column);
        console.log("Entity found: " + entity);

        if (entity && entity instanceof TextEntity && entity === this.currentEntity) {
            console.log("Still current entity");
        } else {
            if (this.currentText) {
                this.persist();
            }
            this.entitySelectionService.selectEntityFor(row, column);
        }
    }

    persist(): void {
        const entity: Entity = new TextEntity(
            this.currentEntity.id(),
            this.currentText!.row,
            this.currentText!.column,
            this.currentText!.text);
        if (this.currentText!.text.length > 0) {
            this.layerService.updateEntity(entity);
            this.currentEntity.endEditing();
        } else {
            this.layerService.deleteEntity(this.currentEntity.id());
        }
    }
}
