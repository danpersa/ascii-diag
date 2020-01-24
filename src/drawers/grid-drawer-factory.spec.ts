import {GridDrawerFactory} from "./drawer-factory";
import {ArrowTipDirectionServiceMock} from "./__mocks__/arrow-tip-direction-service-mock";
import Grid from "./grid";
import {ArrowDirection} from "./arrow";
import {ArrowShape} from "../shapes/arrow-shape";
import {GridArrowDrawer} from "./arrow-drawer";
import {TextShape} from "../shapes/text-shape";
import {GridTextDrawer} from "./text-drawer";
import {BoxShape} from "../shapes/box-shape";
import {GridBoxDrawer} from "./box-drawer";

let gridDrawerFactory: GridDrawerFactory;
let grid: Grid;

describe('create', () => {

    beforeEach(() => {
        const arrowTipDirectionServiceMock = new ArrowTipDirectionServiceMock();
        grid = Grid.create(3, 3)
        gridDrawerFactory = new GridDrawerFactory(arrowTipDirectionServiceMock);
    });

    it('should create a drawer for an arrow shape', () => {
        const arrow = new ArrowShape(1, 1, 1, 2, 2, ArrowDirection.Horizontal);
        const drawer = gridDrawerFactory.create(arrow, grid);
        expect(drawer instanceof GridArrowDrawer).toBe(true);
    });

    it('should create a drawer for a text shape', () => {
        const text = new TextShape(1, 1, 1, "hello");
        const drawer = gridDrawerFactory.create(text, grid);
        expect(drawer instanceof GridTextDrawer).toBe(true);
    });

    it('should create a drawer for a box shape', () => {
        const box = new BoxShape(1, 1, 1, 2, 2);
        const drawer = gridDrawerFactory.create(box, grid);
        expect(drawer instanceof GridBoxDrawer).toBe(true);
    });
});
