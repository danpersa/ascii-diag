import 'jest-canvas-mock';
import {CanvasSelectBoxDrawer} from './select-box-drawer';
import {SelectBox} from "./select-box";
import {VertexDrawer} from './vertex-drawer';

let ctx: CanvasRenderingContext2D;
let vertexDrawerMock: VertexDrawer;

beforeEach(() => {
    let canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 300;
});

describe('draw', () => {

    beforeEach(() => {
        let VertexDrawerMock = jest.fn<VertexDrawer, []>(() => ({
            draw: jest.fn()
        }));
        vertexDrawerMock = new VertexDrawerMock();
        let selectBoxDrawer = new CanvasSelectBoxDrawer(ctx, vertexDrawerMock);
        selectBoxDrawer.draw(SelectBox.fromGrid(5, 5, 10, 10));
    });

    it('should set the correct stroke style', () => {
        expect(ctx.strokeStyle).toBe('#ffa500');
    });

    it('should set the correct line width', () => {
        expect(ctx.lineWidth).toBe(1.0);
    });

    it('should draw five vertexes', () => {
        expect(vertexDrawerMock.draw).toBeCalledTimes(5)
    });
});
