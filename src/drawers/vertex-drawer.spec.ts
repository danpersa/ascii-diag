import 'jest-canvas-mock';
import {CanvasVertexDrawer} from './vertex-drawer';
import {Vertex} from "./vertex";
import {default as React, RefObject} from "react";
import {mockGetContext} from "./__mocks__/get-context";

let ctx: CanvasRenderingContext2D;

describe('draw', () => {
    beforeEach(() => {
        let canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
        let vertexDrawer = new CanvasVertexDrawer(canvasRef);
        ctx = mockGetContext(vertexDrawer);
        vertexDrawer.draw(Vertex.fromCanvas(10, 10));
    });

    it('should set the fill style', () => {
        expect(ctx.fillStyle).toBe("#ffa500");
    });

    it('draw a rectangle', () => {
        expect(ctx.fillRect).toBeCalled();
    });
});
