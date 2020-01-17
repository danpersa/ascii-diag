import {Drawer} from "./drawer";
import {TextShape} from "../shapes/text-shape";
import {GridTextDrawer} from "./text-drawer";
import {BoxShape} from "../shapes/box-shape";
import {GridBoxDrawer} from "./box-drawer";
import {ArrowShape} from "../shapes/arrow-shape";
import {GridArrowDrawer} from "./arrow-drawer";
import {Shape} from "../shapes/shape";
import Grid from "./grid";
import {ArrowTipDirectionService} from "../arrow-tip-direction-service";

export class GridDrawerFactory {
    private readonly arrowTipDirectionService: ArrowTipDirectionService;

    constructor(arrowTipDirectionService: ArrowTipDirectionService) {
        this.arrowTipDirectionService = arrowTipDirectionService;
    }

    create4<T extends Shape>(shape: T, grid: Grid): Drawer<T> {
        if (shape && shape instanceof TextShape) {
            return new GridTextDrawer(grid) as any as Drawer<T>;
        } else if (shape && shape instanceof BoxShape) {
            return new GridBoxDrawer(grid) as any as Drawer<T>;
        } else if (shape && shape instanceof ArrowShape) {
            return new GridArrowDrawer(this.arrowTipDirectionService, grid) as any as Drawer<T>;
        } else {
            throw new Error("No drawer for shape");
        }
    }
}