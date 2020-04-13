import {
    BoxShape,
    ConnectorShape,
    Drawer,
    Grid,
    GridBoxDrawer,
    GridConnectorDrawer,
    GridTextDrawer,
    Shape,
    TextShape
} from "ascii-diag-renderer";

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
