import React from "react";
import {AppState} from "./app-state";
import {AppProps} from "./app";
import {ConnectorShape} from "../shapes/connector-shape";
import {BoxShape} from "../shapes/box-shape";
import {ConnectorTipStyle, LineStyle} from "../drawers/connector";
import {BoxCornerStyle} from "../drawers/box";
import AsciiGrid from "../drawers/grid";
import Constants from "../constants";
import {ToolService} from "../tools/tool-service";


export default class AppStateHelper {

    private readonly component: React.Component<AppProps, AppState>;
    private readonly toolService: ToolService;

    constructor(component: React.Component<AppProps, AppState>, toolService: ToolService) {
        this.component = component;
        this.toolService = toolService;
        this.hideExportDialog = this.hideExportDialog.bind(this);
    }

    initState() {
        this.component.state = {
            currentTool: this.toolService.currentTool(),
            connectorLineStyle: LineStyle.Continuous,
            connectorStartTipStyle: ConnectorTipStyle.Flat,
            connectorEndTipStyle: ConnectorTipStyle.Flat,
            boxCornerStyle: BoxCornerStyle.Square,
            grid: AsciiGrid.create(Constants.numberOfRows, Constants.numberOfColumns),
            isSelectToolButtonSelected: false,
            isTextToolButtonSelected: false,
            isBoxToolButtonSelected: false,
            isConnectorToolButtonSelected: true,
            showBoxOptions: false,
            showConnectorOptions: true,
            showDeleteButton: false,
            exportDialogOpen: false,
            diagramMarkup: "",
        }
    }

    selectConnectorTool() {
        this.unselectTools();
        this.component.setState({
            isConnectorToolButtonSelected: true,
        });
    }

    selectBoxTool() {
        this.unselectTools();
        this.component.setState({
            isBoxToolButtonSelected: true,
        });
    }

    selectTextTool() {
        this.unselectTools();
        this.component.setState({
            isTextToolButtonSelected: true,
        });
    }

    selectSelectTool() {
        this.unselectTools();
        this.component.setState({
            isSelectToolButtonSelected: true,
        });
    }

    showConnectorToolOptions(newShape: ConnectorShape | undefined) {
        this.hideToolOptions();
        this.component.setState({
            showConnectorOptions: true,
        });

        if (newShape) {
            this.component.setState({
                connectorLineStyle: newShape.lineStyle,
                connectorStartTipStyle: newShape.startTipStyle,
                connectorEndTipStyle: newShape.endTipStyle,
            })
        }
    }

    showBoxToolOptions(newShape: BoxShape | undefined) {
        this.hideToolOptions();
        this.component.setState({
            showBoxOptions: true,
        });

        if (newShape) {
            this.component.setState({
                boxCornerStyle: newShape.cornerStyle,
            });
        }

    }

    hideExportDialog(): void {
        this.component.setState({
            exportDialogOpen: false,
        });
    }

    private unselectTools() {
        this.component.setState({
            isConnectorToolButtonSelected: false,
            isTextToolButtonSelected: false,
            isBoxToolButtonSelected: false,
            isSelectToolButtonSelected: false,
        });
    }

    hideToolOptions() {
        this.component.setState({
            showBoxOptions: false,
            showConnectorOptions: false
        });
    }

    showDeleteButton() {
        this.component.setState({
            showDeleteButton: true
        })
    }

    hideDeleteButton() {
        this.component.setState({
            showDeleteButton: false
        })
    }

}
