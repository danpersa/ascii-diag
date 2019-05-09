import {Editor} from "./editor";
import {BoxEditor} from "./box-editor";
import {Entity} from "../entities/entity";
import {BoxEntity} from "../entities/box-entity";
import {SelectBoxDrawer} from "../select-box-drawer";

export class EditorService {

    private _currentEditor: Editor | null = null;
    private readonly selectBoxDrawer: SelectBoxDrawer;

    constructor(selectBoxDrawer: SelectBoxDrawer) {
        this.selectBoxDrawer = selectBoxDrawer;
    }


    currentEditor(): Editor | null {
        return this._currentEditor
    }

    edit(entity: Entity): void {
        if (entity && entity instanceof BoxEntity) {
            this._currentEditor = new BoxEditor(entity, this.selectBoxDrawer);
        }
    }

    doneEditing(): void {
        this._currentEditor = null;
    }
}
