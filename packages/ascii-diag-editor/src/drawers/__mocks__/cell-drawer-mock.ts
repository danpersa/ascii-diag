import {CellDrawer} from "../cell-drawer";

export let CellDrawerMock = jest.fn<CellDrawer, []>(() => ({
    draw: jest.fn()
}));