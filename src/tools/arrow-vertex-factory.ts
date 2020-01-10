import {Vertex} from "../drawers/vertex";
import {Arrow, ArrowDirection} from "../drawers/arrow";
import Constants from "../constants";


export class ArrowVertexFactory {

    createFlipVertex(arrow: Arrow): Vertex | null {
        // vertical or horizontal
        if (arrow.startRow === arrow.endRow || arrow.startColumn === arrow.endColumn) {
            return null
        }

        if (arrow.startDirection === ArrowDirection.Horizontal) {
            const row = arrow.startRow < arrow.endRow ? arrow.startRow : arrow.startRow + 1;
            const column = arrow.startColumn > arrow.endColumn ? arrow.endColumn : arrow.endColumn + 1;
            return Vertex.fromGrid(row, column);
        } else if (arrow.startDirection === ArrowDirection.Vertical) {
            const row = arrow.startRow > arrow.endRow ? arrow.endRow : arrow.endRow + 1;
            const column = arrow.startColumn < arrow.endColumn ? arrow.startColumn : arrow.startColumn + 1;
            return Vertex.fromGrid(row, column);
        }

        return null;
    }

    createStartArrowVertex(arrow: Arrow): Vertex {
        if (arrow.startDirection === ArrowDirection.Horizontal) {
            const column = arrow.startColumn < arrow.endColumn ? arrow.startColumn : arrow.startColumn + 1;
            return Vertex.fromCanvas(column * Constants.densityX, arrow.startRow * Constants.densityY + Constants.densityY / 2);
        } else {
            const row = arrow.startRow < arrow.endRow ? arrow.startRow : arrow.startRow + 1;
            return Vertex.fromCanvas(arrow.startColumn * Constants.densityX + Constants.densityX / 2, row * Constants.densityY);
        }
    }

    createEndArrowVertex(arrow: Arrow): Vertex {
        if (arrow.startDirection === ArrowDirection.Vertical) {
            const column = arrow.startColumn > arrow.endColumn ? arrow.endColumn : arrow.endColumn + 1;
            return Vertex.fromCanvas(column * Constants.densityX, arrow.endRow * Constants.densityY + Constants.densityY / 2);
        } else {
            const row = arrow.startRow > arrow.endRow ? arrow.endRow : arrow.endRow + 1;
            return Vertex.fromCanvas(arrow.endColumn * Constants.densityX + Constants.densityX / 2, row * Constants.densityY);
        }
    }
}
