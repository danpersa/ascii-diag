import {Tool} from "../tools/tool";
import {ConnectorTipStyle, LineStyle} from "../drawers/connector";
import {BoxCornerStyle} from "../drawers/box";
import Grid from "../drawers/grid";

export type AppState = {
    currentTool: Tool,
    connectorLineStyle: LineStyle,
    connectorStartTipStyle: ConnectorTipStyle,
    connectorEndTipStyle: ConnectorTipStyle,
    boxCornerStyle: BoxCornerStyle,
    exportDialogOpen: boolean,
    diagramMarkup: string,
    grid: Grid,
    isSelectToolButtonSelected: boolean,
    isTextToolButtonSelected: boolean,
    isBoxToolButtonSelected: boolean,
    isConnectorToolButtonSelected: boolean,
    showBoxOptions: boolean,
    showConnectorOptions: boolean,
    showDeleteButton: boolean,
}
