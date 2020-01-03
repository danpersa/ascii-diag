import 'jest-canvas-mock';
import {CanvasVertexDrawer} from './vertex-drawer';
import {Vertex} from "./vertex";
import {CellDrawer} from "./cell-drawer";
import {CanvasTextDrawer} from "./text-drawer";
import {Text} from "./text";
import {Domain} from "./cell";
import Cell = Domain.Cell;

let cellDrawerMock: CellDrawer;

describe('draw', () => {
    beforeEach(() => {
        let CellDrawerMock = jest.fn<CellDrawer, []>(() => ({
            draw: jest.fn()
        }));
        cellDrawerMock = new CellDrawerMock();
        let textDrawer = new CanvasTextDrawer(cellDrawerMock);
        textDrawer.draw(Text.fromGrid(5, 10, "Hi"));
    });

    it('cell draw should be called for each letter', () => {
        expect(cellDrawerMock.draw).toBeCalledTimes(2)
    });

    it('cell draw should be called with the right parameters', () => {
        expect(cellDrawerMock.draw).nthCalledWith(1, Cell.Builder.from(5, 10).text('H'));
        expect(cellDrawerMock.draw).nthCalledWith(2, Cell.Builder.from(5, 11).text('i'));
    });
});
