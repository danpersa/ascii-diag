import 'jest-canvas-mock';
import {CellDrawer} from "./cell-drawer";
import {CellDrawerMock} from "./__mocks__/cell-drawer-mock";
import {CanvasGridDrawer} from "./grid-drawer";
import Grid from "./grid";

let cellDrawerMock: CellDrawer;

describe('draw', () => {
    beforeEach(() => {
        cellDrawerMock = new CellDrawerMock();
        let gridDrawer = new CanvasGridDrawer(cellDrawerMock);
        let grid = Grid.create(3, 3);
        gridDrawer.draw(grid);
    });

    it('cell draw should be called for each grid cell', () => {
        expect(cellDrawerMock.draw).toBeCalledTimes(9)
    });
});
