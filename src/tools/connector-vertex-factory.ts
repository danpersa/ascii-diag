import {Vertex} from "../drawers/vertex";
import {Connector, ConnectorType, isEdgedConnector, isVerticalConnector} from "../drawers/connector";
import Constants from "../constants";


export class ConnectorVertexFactory {

    createFlipVertex(connectorType: ConnectorType): Vertex | null {
        // vertical or horizontal or one dot
        if (!isEdgedConnector(connectorType)) {
            return null;
        }

        const row = connectorType.intersectionPoint.row < connectorType.verticalEdge.start.row ? connectorType.intersectionPoint.row : connectorType.intersectionPoint.row + 1;
        const column = connectorType.intersectionPoint.column < connectorType.horizontalEdge.start.column ? connectorType.intersectionPoint.column : connectorType.intersectionPoint.column + 1;
        return Vertex.fromGrid(row, column);
    }

    createHorizontalVertex(connector: Connector): Vertex {
        if (connector.horizontalEdge !== null) {
            const offset = connector.horizontalEdge.start.column < connector.horizontalEdge.end.column ? 0 : 1;
            const column = connector.horizontalEdge.start.column;
            const row = connector.horizontalEdge.start.row;
            return Vertex.fromCanvas((column + offset) * Constants.densityX, row * Constants.densityY + Constants.densityY / 2);
        } else if (connector.verticalEdge !== null) {
            const column = connector.verticalEdge.end.column;
            const row = connector.verticalEdge.end.row;
            return Vertex.fromCanvas(column * Constants.densityX, row * Constants.densityY + Constants.densityY / 2);
        } else {
            const column = connector.intersectionPoint!.column;
            const row = connector.intersectionPoint!.row;
            return Vertex.fromCanvas(column * Constants.densityX, row * Constants.densityY + Constants.densityY / 2);
        }
    }

    createVerticalVertex(connector: Connector): Vertex {
        if (connector.verticalEdge !== null) {
            const offset = connector.verticalEdge.start.row < connector.verticalEdge.end.row ? 0 : 1;
            const column = connector.verticalEdge.start.column;
            const row = connector.verticalEdge.start.row;
            return Vertex.fromCanvas(column * Constants.densityX + Constants.densityX / 2, (row + offset) * Constants.densityY);
        } else if (connector.horizontalEdge !== null) {
            const column = connector.horizontalEdge.end.column;
            const row = connector.horizontalEdge.end.row;
            return Vertex.fromCanvas(column * Constants.densityX + Constants.densityX / 2, row * Constants.densityY);
        } else {
            const column = connector.intersectionPoint!.column;
            const row = connector.intersectionPoint!.row;
            return Vertex.fromCanvas(column * Constants.densityX + Constants.densityX / 2, row * Constants.densityY);
        }
    }
}
