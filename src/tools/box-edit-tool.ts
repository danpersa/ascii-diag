import {Tool} from "./tool";
import {LayerService} from "../layer-service";
import {SelectBoxDrawer} from "../select-box-drawer";
import {EditorService} from "../editors/editor-service";

export class BoxEditTool implements Tool {

    private readonly layerService: LayerService;
    private readonly selectBoxDrawer: SelectBoxDrawer;
    private readonly editorService: EditorService;

    //private editor: Editor | null = null;

    constructor(layerService: LayerService, selectBoxDrawer: SelectBoxDrawer, editorService: EditorService) {
        this.layerService = layerService;
        this.selectBoxDrawer = selectBoxDrawer;
        this.editorService = editorService;
    }

    mouseDown(row: number, column: number): void {
        console.log("Click on row: " + row + " column=" + column);

        const entity = this.layerService.getEntity(row, column);
        console.log("Entity found: " + typeof entity);

        if (entity) {
            this.editorService.edit(entity);
        } else {
            this.editorService.doneEditing();
        }

    }

    renderEditor() {
        const currentEditor = this.editorService.currentEditor();
        if (currentEditor) {
            currentEditor.draw();
        }
    }

    drag(startRow: number, startColumn: number, row: number, column: number): void {

    }

    endDrag(row: number, column: number): void {
    }

    keyDown(key: string): void {
    }

    persist(): void {
    }
}
