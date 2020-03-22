import {GridDrawerFactory} from "./drawer-factory";
import Grid from "./grid";
import {LineStyle} from "./connector";
import {ConnectorShape} from "../shapes/connector-shape";
import {GridConnectorDrawer} from "./connector-drawer";
import {TextShape} from "../shapes/text-shape";
import {GridTextDrawer} from "./text-drawer";
import {BoxShape} from "../shapes/box-shape";
import {GridBoxDrawer} from "./box-drawer";
import {BoxCornerStyle} from "./box";

let gridDrawerFactory: GridDrawerFactory;
let grid: Grid;

describe('create', () => {

    beforeEach(() => {
        grid = Grid.create(3, 3);
        gridDrawerFactory = new GridDrawerFactory();
    });

    it('should create a drawer for an connector shape', () => {
        const connector = ConnectorShape.createShapeByStartPoints(1,
            {row: 0, column: 0},
            {row: 0, column: 0},
            {row: 0, column: 0});
        const drawer = gridDrawerFactory.create(connector, grid);
        expect(drawer instanceof GridConnectorDrawer).toBe(true);
    });

    it('should create a drawer for a text shape', () => {
        const text = new TextShape(1, 1, 1, "hello");
        const drawer = gridDrawerFactory.create(text, grid);
        expect(drawer instanceof GridTextDrawer).toBe(true);
    });

    it('should create a drawer for a box shape', () => {
        const box = new BoxShape(1, 1, 1, 2, 2,
            BoxCornerStyle.Square, LineStyle.Continuous);
        const drawer = gridDrawerFactory.create(box, grid);
        expect(drawer instanceof GridBoxDrawer).toBe(true);
    });
});
