import 'jest-canvas-mock';
import {CanvasSelectBoxDrawer} from './select-box-drawer';
import {SelectBox} from "../entities/select-box";
import {VertexDrawer} from './vertex-drawer';
import {VertexDrawerMock} from "./__mocks__/vertex-drawer-mock";
import * as React from "react";
import {RefObject} from "react";
import {mockGetContext} from "./__mocks__/get-context";

let ctx: CanvasRenderingContext2D;
let vertexDrawerMock: VertexDrawer;

describe('draw', () => {

    beforeEach(() => {
        vertexDrawerMock = new VertexDrawerMock();
        let canvasRef: RefObject<HTMLCanvasElement> = React.createRef();
        let selectBoxDrawer = new CanvasSelectBoxDrawer(canvasRef, vertexDrawerMock);
        ctx = mockGetContext(selectBoxDrawer);
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
