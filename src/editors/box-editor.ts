import {Editor} from "./editor";
import {BoxEntity} from "../entities/box-entity";
import {SelectBoxDrawer} from "../select-box-drawer";
import {SelectBox} from "../select-box";


export class BoxEditor implements Editor {
    private selectBoxDrawer: SelectBoxDrawer;
    private entity: BoxEntity;
    private selectBox: SelectBox;

    constructor(entity: BoxEntity, selectBoxDrawer: SelectBoxDrawer) {
        this.entity = entity;
        this.selectBoxDrawer = selectBoxDrawer;
        this.selectBox = new SelectBox(this.entity.topRow, this.entity.leftColumn, this.entity.bottomRow, this.entity.rightColumn);
    }

    draw(): void {
        this.selectBoxDrawer.draw(this.selectBox);
    }

    private hoverTopLeftResizer(): void {
        document.body.style.cursor = 'nw-resize';
    }

    mouseMove(x: number, y: number) {
        if (this.selectBox.topLeftVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'nw-resize';
        } else if (this.selectBox.topRightVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'ne-resize';
        } else if (this.selectBox.bottomLeftVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'sw-resize';
        } else if (this.selectBox.bottomRightVertex.containsPoint(x, y)) {
            document.body.style.cursor = 'se-resize';
        }
    }
}
