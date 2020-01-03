import {VertexDrawer} from "../vertex-drawer";

export let VertexDrawerMock = jest.fn<VertexDrawer, []>(() => ({
    draw: jest.fn()
}));
