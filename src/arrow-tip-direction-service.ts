import {Arrow, ArrowDirection, ArrowTipDirection} from "./drawers/arrow";

export class ArrowTipDirectionService {

    startTipDirection(arrow: Arrow): ArrowTipDirection | null {
        // horizontal
        if (arrow.startRow == arrow.endRow) {
            if (arrow.startColumn > arrow.endColumn) {
                return ArrowTipDirection.East;
            } else if (arrow.startColumn < arrow.endColumn) {
                return ArrowTipDirection.West;
            } else {
                return null;
            }
            // vertical
        } else if (arrow.startColumn == arrow.endColumn) {
            if (arrow.startRow > arrow.endRow) {
                return ArrowTipDirection.South;
            } else if (arrow.startRow < arrow.endRow) {
                return ArrowTipDirection.North;
            } else {
                return null;
            }
        } else {
            if (arrow.startDirection === ArrowDirection.Vertical) {
                if (arrow.startRow > arrow.endRow) {
                    return ArrowTipDirection.South;
                } else {
                    return ArrowTipDirection.North;
                }
            } else if (arrow.startDirection === ArrowDirection.Horizontal) {
                if (arrow.startColumn > arrow.endColumn) {
                    return ArrowTipDirection.East;
                } else {
                    return ArrowTipDirection.West;
                }
            } else {
                return null
            }
        }
    }

    endTipDirection(arrow: Arrow): ArrowTipDirection | null {
        // horizontal
        if (arrow.startRow == arrow.endRow) {
            if (arrow.startColumn > arrow.endColumn) {
                return ArrowTipDirection.West;
            } else if (arrow.startColumn < arrow.endColumn) {
                return ArrowTipDirection.East;
            } else {
                return null;
            }
            // vertical
        } else if (arrow.startColumn == arrow.endColumn) {
            if (arrow.startRow > arrow.endRow) {
                return ArrowTipDirection.North; // ∧
            } else if (arrow.startRow < arrow.endRow) {
                return ArrowTipDirection.South; // ∨
            } else {
                return null;
            }
        } else {
            if (arrow.startDirection === ArrowDirection.Horizontal) {
                if (arrow.startRow > arrow.endRow) {
                    return ArrowTipDirection.North; // ∧
                } else {
                    return ArrowTipDirection.South; // ∨
                }
            } else if (arrow.startDirection === ArrowDirection.Vertical) {
                if (arrow.startColumn > arrow.endColumn) {
                    return ArrowTipDirection.West;
                } else {
                    return ArrowTipDirection.East;
                }
            } else {
                return null
            }
        }
    }
}
