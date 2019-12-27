import 'jest-canvas-mock';
import {CanvasVertexDrawer} from './vertex-drawer';
import {Vertex} from "./vertex";

let ctx: CanvasRenderingContext2D;

beforeEach(() => {
    let canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d')!;
    canvas.width = 400;
    canvas.height = 300;
});

describe('draw', () => {
    beforeEach(() => {
        let vertexDrawer = new CanvasVertexDrawer(ctx);
        vertexDrawer.draw(Vertex.fromCanvas(10, 10));
    });

    it('should set the fill style', () => {
        expect(ctx.fillStyle).toBe("#ffa500");
    });

    it('draw a rectangle', () => {
        expect(ctx.fillRect).toBeCalled();
    });
});
