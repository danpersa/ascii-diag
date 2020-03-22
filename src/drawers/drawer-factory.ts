import {Drawer} from "./drawer";
import {TextShape} from "../shapes/text-shape";
import {GridTextDrawer} from "./text-drawer";
import {BoxShape} from "../shapes/box-shape";
import {GridBoxDrawer} from "./box-drawer";
import {ConnectorShape} from "../shapes/connector-shape";
import {GridConnectorDrawer} from "./connector-drawer";
import {Shape} from "../shapes/shape";
import Grid from "./grid";

export class GridDrawerFactory {

    constructor() {
    }

    create<T extends Shape>(shape: T, grid: Grid): Drawer<T> {
        if (shape && shape instanceof TextShape) {
            return new GridTextDrawer(grid) as any as Drawer<T>;
        } else if (shape && shape instanceof BoxShape) {
            return new GridBoxDrawer(grid) as any as Drawer<T>;
        } else if (shape && shape instanceof ConnectorShape) {
            return new GridConnectorDrawer(grid) as any as Drawer<T>;
        } else {
            throw new Error("No drawer for shape");
        }
    }
}
