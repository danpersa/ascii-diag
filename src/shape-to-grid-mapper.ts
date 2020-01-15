import {Shape} from "./shapes/shape";
import Grid from "./drawers/grid";
import {TextShape} from "./shapes/text-shape";
import {BoxShape} from "./shapes/box-shape";
import {ArrowShape} from "./shapes/arrow-shape";
import {GridTextDrawer} from "./drawers/text-drawer";
import {GridBoxDrawer} from "./drawers/box-drawer";
import {GridArrowDrawer} from "./drawers/arrow-drawer";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";

export class ShapeToGridMapper {

    private readonly arrowTipDirectionService: ArrowTipDirectionService;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
    }

    addShapeToGrid(shape: Shape, grid: Grid): void {
        if (shape && shape instanceof TextShape) {
            const textDrawer = new GridTextDrawer(grid);
            textDrawer.draw(shape);
        } else if (shape && shape instanceof BoxShape) {
            const boxDrawer = new GridBoxDrawer(grid);
            boxDrawer.draw(shape);
        } else if (shape && shape instanceof ArrowShape) {
            const arrowDrawer = new GridArrowDrawer(this.arrowTipDirectionService, grid);
            arrowDrawer.draw(shape);
        } else {
            throw new Error("No drawer for shape");
        }
    }
}
