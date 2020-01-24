import {Vertex} from "../drawers/vertex";
import {Connector, ConnectorDirection} from "../drawers/connector";
import Constants from "../constants";


export class ConnectorVertexFactory {

    createFlipVertex(connector: Connector): Vertex | null {
        // vertical or horizontal
        if (connector.startRow === connector.endRow || connector.startColumn === connector.endColumn) {
            return null
        }

        if (connector.startDirection === ConnectorDirection.Horizontal) {
            const row = connector.startRow < connector.endRow ? connector.startRow : connector.startRow + 1;
            const column = connector.startColumn > connector.endColumn ? connector.endColumn : connector.endColumn + 1;
            return Vertex.fromGrid(row, column);
        } else if (connector.startDirection === ConnectorDirection.Vertical) {
            const row = connector.startRow > connector.endRow ? connector.endRow : connector.endRow + 1;
            const column = connector.startColumn < connector.endColumn ? connector.startColumn : connector.startColumn + 1;
            return Vertex.fromGrid(row, column);
        }

        return null;
    }

    createStartVertex(connector: Connector): Vertex {
        if (connector.startDirection === ConnectorDirection.Horizontal) {
            const column = connector.startColumn < connector.endColumn ? connector.startColumn : connector.startColumn + 1;
            return Vertex.fromCanvas(column * Constants.densityX, connector.startRow * Constants.densityY + Constants.densityY / 2);
        } else {
            const row = connector.startRow < connector.endRow ? connector.startRow : connector.startRow + 1;
            return Vertex.fromCanvas(connector.startColumn * Constants.densityX + Constants.densityX / 2, row * Constants.densityY);
        }
    }

    createEndVertex(connector: Connector): Vertex {
        if (connector.startDirection === ConnectorDirection.Vertical) {
            const column = connector.startColumn > connector.endColumn ? connector.endColumn : connector.endColumn + 1;
            return Vertex.fromCanvas(column * Constants.densityX, connector.endRow * Constants.densityY + Constants.densityY / 2);
        } else {
            const row = connector.startRow > connector.endRow ? connector.endRow : connector.endRow + 1;
            return Vertex.fromCanvas(connector.endColumn * Constants.densityX + Constants.densityX / 2, row * Constants.densityY);
        }
    }
}
