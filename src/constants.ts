import {ArrowDirection} from "./arrow";

export default class Constants {
    static readonly canvasWidth = 620;
    static readonly canvasHeight = 400;
    static readonly densityX = 10;
    static readonly densityY = 20;

    static readonly numberOfRows = Constants.canvasHeight / Constants.densityY;
    static readonly numberOfColumns = Constants.canvasWidth / Constants.densityX;

    static readonly font = '11px Courier';
    static readonly accentColor = `rgb(255, 165, 0, 1.0)`;
    static readonly vertexRadius = 7;
    static readonly arrowStartDirection = ArrowDirection.Horizontal;
}
