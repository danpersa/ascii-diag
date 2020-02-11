import {Drawer} from "./drawer";
import {TextShape} from "../shapes/text-shape";
import {GridTextDrawer} from "./text-drawer";
import {BoxShape} from "../shapes/box-shape";
import {GridBoxDrawer} from "./box-drawer";
import {ConnectorShape} from "../shapes/connector-shape";
import {GridConnectorDrawer} from "./connector-drawer";
import {Shape} from "../shapes/shape";
import Grid from "./grid";
import {ConnectorTipDirectionService} from "../connector-tip-direction-service";

export class GridDrawerFactory {
    private readonly connectorTipDirectionService: ConnectorTipDirectionService;

    constructor(connectorTipDirectionService: ConnectorTipDirectionService) {
        this.connectorTipDirectionService = connectorTipDirectionService;
    }

    create<T extends Shape>(shape: T, grid: Grid): Drawer<T> {
        if (shape && shape instanceof TextShape) {
            return new GridTextDrawer(grid) as any as Drawer<T>;
        } else if (shape && shape instanceof BoxShape) {
            return new GridBoxDrawer(grid) as any as Drawer<T>;
        } else if (shape && shape instanceof ConnectorShape) {
            return new GridConnectorDrawer(this.connectorTipDirectionService, grid) as any as Drawer<T>;
        } else {
            throw new Error("No drawer for shape");
        }
    }
}