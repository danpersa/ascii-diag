import {ConnectorDirection, LineStyle} from "./drawers/connector";

export default class Constants {
    static readonly canvasWidth = 900;
    static readonly canvasHeight = 600;
    static readonly densityX = 10;
    static readonly densityY = 20;

    static readonly numberOfRows = Constants.canvasHeight / Constants.densityY;
    static readonly numberOfColumns = Constants.canvasWidth / Constants.densityX;

    static readonly font = '11px Courier';
    static readonly accentColor = `rgb(255, 165, 0, 1.0)`;
    static readonly vertexRadius = 8;
    static readonly halfVertexRadius = Constants.vertexRadius / 2;
    static readonly connectorStartDirection = ConnectorDirection.Horizontal;

    static readonly continuousLineDashPattern = '0';
    static readonly dashedLineDashPattern = '8,7';
    static readonly dottedLineDashPattern = '1,4';


    static readonly continuousLineSymbol = '';
    static readonly dashedLineSymbol = ';';
    static readonly dottedLineSymbol = ':';
}
