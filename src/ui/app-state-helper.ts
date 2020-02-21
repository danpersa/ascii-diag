import React from "react";
import {AppState} from "./app-state";
import {AppProps} from "./app";
import {ConnectorShape} from "../shapes/connector-shape";
import {BoxShape} from "../shapes/box-shape";


export default class AppStateHelper {

    private readonly component: React.Component<AppProps, AppState>;

    constructor(component: React.Component<AppProps, AppState>) {
        this.component = component;
        this.hideExportDialog = this.hideExportDialog.bind(this);
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
}
