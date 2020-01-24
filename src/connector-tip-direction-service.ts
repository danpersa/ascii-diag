import {Connector, ConnectorDirection, ConnectorTipDirection} from "./drawers/connector";

export class ConnectorTipDirectionService {

    startTipDirection(connector: Connector): ConnectorTipDirection | null {
        // horizontal
        if (connector.startRow == connector.endRow) {
            if (connector.startColumn > connector.endColumn) {
                return ConnectorTipDirection.East;
            } else if (connector.startColumn < connector.endColumn) {
                return ConnectorTipDirection.West;
            } else {
                return null;
            }
            // vertical
        } else if (connector.startColumn == connector.endColumn) {
            if (connector.startRow > connector.endRow) {
                return ConnectorTipDirection.South;
            } else if (connector.startRow < connector.endRow) {
                return ConnectorTipDirection.North;
            } else {
                return null;
            }
        } else {
            if (connector.startDirection === ConnectorDirection.Vertical) {
                if (connector.startRow > connector.endRow) {
                    return ConnectorTipDirection.South;
                } else {
                    return ConnectorTipDirection.North;
                }
            } else if (connector.startDirection === ConnectorDirection.Horizontal) {
                if (connector.startColumn > connector.endColumn) {
                    return ConnectorTipDirection.East;
                } else {
                    return ConnectorTipDirection.West;
                }
            } else {
                return null
            }
        }
    }

    endTipDirection(connector: Connector): ConnectorTipDirection | null {
        // horizontal
        if (connector.startRow == connector.endRow) {
            if (connector.startColumn > connector.endColumn) {
                return ConnectorTipDirection.West;
            } else if (connector.startColumn < connector.endColumn) {
                return ConnectorTipDirection.East;
            } else {
                return null;
            }
            // vertical
        } else if (connector.startColumn == connector.endColumn) {
            if (connector.startRow > connector.endRow) {
                return ConnectorTipDirection.North; // ∧
            } else if (connector.startRow < connector.endRow) {
                return ConnectorTipDirection.South; // ∨
            } else {
                return null;
            }
        } else {
            if (connector.startDirection === ConnectorDirection.Horizontal) {
                if (connector.startRow > connector.endRow) {
                    return ConnectorTipDirection.North; // ∧
                } else {
                    return ConnectorTipDirection.South; // ∨
                }
            } else if (connector.startDirection === ConnectorDirection.Vertical) {
                if (connector.startColumn > connector.endColumn) {
                    return ConnectorTipDirection.West;
                } else {
                    return ConnectorTipDirection.East;
                }
            } else {
                return null
            }
        }
    }
}
