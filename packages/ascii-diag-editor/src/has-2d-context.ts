import {RefObject} from "react";

export default interface Has2DContext {
    readonly canvasRef: RefObject<HTMLCanvasElement>;

    getContext(): CanvasRenderingContext2D;
}
