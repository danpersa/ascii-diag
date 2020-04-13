import {Tool} from "../tools/tool";
import {BoxCornerStyle, ConnectorTipStyle, Grid, LineStyle} from "ascii-diag-renderer";

export type AppState = {
    currentTool: Tool,
    connectorLineStyle: LineStyle,
    connectorHorizontalTipStyle: ConnectorTipStyle,
    connectorVerticalTipStyle: ConnectorTipStyle,
    boxCornerStyle: BoxCornerStyle,
    boxLineStyle: LineStyle,
    exportDialogOpen: boolean,
    diagramMarkup: string,
    importDialogOpen: boolean,
    grid: Grid,
    isSelectToolButtonSelected: boolean,
    isTextToolButtonSelected: boolean,
    isBoxToolButtonSelected: boolean,
    isConnectorToolButtonSelected: boolean,
    showBoxOptions: boolean,
    showConnectorOptions: boolean,
    showDeleteButton: boolean,
}
