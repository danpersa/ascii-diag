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
import AsciiTextParser from "../parser/ascii-text-parser";
import Grid from "../drawers/grid";
import {LayerService} from "../layer-service";


export default class AppStateHelper {

    private readonly component: React.Component<AppProps, AppState>;
    private readonly toolService: ToolService;
    private readonly layerService: LayerService;
    private readonly parser: AsciiTextParser;

    constructor(component: React.Component<AppProps, AppState>, toolService: ToolService, layerService: LayerService, parser: AsciiTextParser) {
        this.component = component;
        this.toolService = toolService;
        this.layerService = layerService;
        this.parser = parser;
        this.hideExportDialog = this.hideExportDialog.bind(this);
        this.hideImportDialog = this.hideImportDialog.bind(this);
        this.importDiagram = this.importDiagram.bind(this);
    }

    initState() {
        this.component.state = {
            currentTool: this.toolService.currentTool(),
            connectorLineStyle: LineStyle.Continuous,
            connectorStartTipStyle: ConnectorTipStyle.Flat,
            connectorEndTipStyle: ConnectorTipStyle.Flat,
            boxCornerStyle: BoxCornerStyle.Square,
            boxLineStyle: LineStyle.Continuous,
            grid: AsciiGrid.create(Constants.numberOfRows, Constants.numberOfColumns),
            isSelectToolButtonSelected: false,
            isTextToolButtonSelected: false,
            isBoxToolButtonSelected: false,
            isConnectorToolButtonSelected: true,
            showBoxOptions: false,
            showConnectorOptions: true,
            showDeleteButton: false,
            exportDialogOpen: false,
            importDialogOpen: false,
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
                boxLineStyle: newShape.lineStyle,
            });
        }

    }

    hideExportDialog(): void {
        this.component.setState({
            exportDialogOpen: false,
        });
    }

    hideImportDialog(): void {
        this.component.setState({
            importDialogOpen: false,
        });
    }

    importDiagram(markup: string): void {
        this.component.setState({
            importDialogOpen: false,
        });
        console.log("We import the diagram with the markup: " + markup);

        const grid = Grid.fromString(markup);
        const shapes = this.parser.parse(grid);
        this.layerService.deleteAllShapes();
        shapes.forEach(shape => this.layerService.createShape(shape));
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
