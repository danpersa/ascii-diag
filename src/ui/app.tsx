import React, {RefObject} from 'react';
import ReactDOM from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import {Button, createStyles, Grid, Theme, Toolbar, withStyles, WithStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DiagCanvas from "./diag-canvas";
import CursorDefault from "mdi-material-ui/CursorDefault";
import {
    ArrowLeft,
    ArrowRight,
    CheckboxBlankOutline,
    CurrentDc,
    Delete,
    DotsHorizontal,
    Export,
    Import,
    FormatText,
    Minus,
    RayStartArrow,
    RoundedCorner,
    SquareOutline
} from "mdi-material-ui";
import SvgCanvas from "./svg-diag";
import {LayerService} from "../layer-service";
import {DiagToSvg} from "../renderers/diag-to-svg";
import {SelectedShapeChangedListener, Tools} from "../tools/tool";
import Constants from "../constants";
import {ShapeUpdateNotificationService} from "../shape-update-notification-service";
import {CellToShapeService} from "../cell-to-shape-service";
import {ConnectorTipDirectionService} from "../connector-tip-direction-service";
import IconMenu from "./icon-menu";
import {ConnectorTipStyle, LineStyle} from "../drawers/connector";
import {AppState} from "./app-state";
import {StateProvider} from "./state-provider";
import {ShapeIdService} from "../shapes/shape-id-service";
import {CanvasCellDrawer} from "../drawers/cell-drawer";
import {CanvasVertexDrawer} from "../drawers/vertex-drawer";
import {CanvasSelectBoxDrawer} from "../drawers/select-box-drawer";
import {CanvasBoxDrawer} from "../drawers/box-drawer";
import {CanvasConnectorDrawer} from "../drawers/connector-drawer";
import {CanvasTextDrawer} from "../drawers/text-drawer";
import {CanvasCursorDrawer} from "../drawers/cursor-drawer";
import {GridDrawerFactory} from "../drawers/drawer-factory";
import {ToolService} from "../tools/tool-service";
import AsciiDiag from "../ascii-diag";
import DiagToSvgProvider from "./diag-to-svg-provider";
import {ConnectorCreateTool} from "../tools/connector-create-tool";
import {TextCreateTool} from "../tools/text-create-tool";
import {BoxCreateTool} from "../tools/box-create-tool";
import {SelectTool} from "../tools/select-tool";
import {TextEditTool} from "../tools/text-edit-tool";
import {Shape} from "../shapes/shape";
import {ConnectorShape} from "../shapes/connector-shape";
import {BoxShape} from "../shapes/box-shape";
import {BoxCornerStyle} from "../drawers/box";
import ExportDialog from "./export-dialog";
import ImportDialog from "./import-dialog";
import AsciiGrid from "../drawers/grid";
import AppStateHelper from "./app-state-helper";

const appStyles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        margin: 10,
        minWidth: '600px',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    paperStyles: {
        marginTop: theme.spacing(1),
        maxWidth: 900
    }
});

const margin = {
    margin: '10px',
    display: 'inline-block'
};

const padding = {
    paddingTop: '20px',
    paddingBottom: '50px',
    paddingLeft: '20px',
    paddingRight: '20px',
};

export interface AppProps extends WithStyles<typeof appStyles> {
}

const AppWithStyles = withStyles(appStyles)(
    class extends React.Component<AppProps, AppState> implements SelectedShapeChangedListener {

        private readonly canvasDivRef: RefObject<HTMLCanvasElement> = React.createRef();
        private readonly svgDivRef: RefObject<HTMLDivElement> = React.createRef();
        private readonly layerService: LayerService;
        private readonly shapeUpdateNotificationService: ShapeUpdateNotificationService;
        private readonly cellToShapeService: CellToShapeService;
        private readonly arrowTipDirectionService: ConnectorTipDirectionService;
        private readonly stateProvider: StateProvider;
        private readonly toolService: ToolService;
        private readonly cellDrawer: CanvasCellDrawer;
        private readonly gridDrawerFactory: GridDrawerFactory;
        private readonly diagToSvgProvider: DiagToSvgProvider;
        private readonly appStateHelper: AppStateHelper;

        constructor(props: AppProps) {
            super(props);
            this.shapeUpdateNotificationService = new ShapeUpdateNotificationService();
            this.layerService = new LayerService(this.shapeUpdateNotificationService);
            this.arrowTipDirectionService = new ConnectorTipDirectionService();
            this.cellToShapeService = new CellToShapeService(Constants.numberOfRows, Constants.numberOfColumns,
                this.arrowTipDirectionService, this.layerService);

            this.stateProvider = new StateProvider(this);

            const entityIdService = new ShapeIdService();

            const arrowTipDirectionService = new ConnectorTipDirectionService();
            this.cellDrawer = new CanvasCellDrawer(this.canvasDivRef);
            const vertexDrawer = new CanvasVertexDrawer(this.canvasDivRef);
            const selectBoxDrawer = new CanvasSelectBoxDrawer(this.canvasDivRef, vertexDrawer);
            const boxDrawer = new CanvasBoxDrawer(this.cellDrawer);
            const arrowDrawer = new CanvasConnectorDrawer(this.cellDrawer, arrowTipDirectionService);
            const textDrawer = new CanvasTextDrawer(this.cellDrawer);
            const cursorDrawer = new CanvasCursorDrawer(this.canvasDivRef);
            this.gridDrawerFactory = new GridDrawerFactory(arrowTipDirectionService);

            this.toolService = new ToolService(
                this.layerService,
                selectBoxDrawer,
                boxDrawer,
                entityIdService,
                textDrawer,
                cursorDrawer,
                vertexDrawer,
                arrowDrawer,
                this.cellToShapeService);
            this.toolService.registerSelectedShapeChangedListeners(this);
            this.shapeUpdateNotificationService.register(this.cellToShapeService);
            this.shapeUpdateNotificationService.register(this.toolService);
            this.appStateHelper = new AppStateHelper(this, this.toolService);
            this.appStateHelper.initState();

            const diagToSvg = new DiagToSvg(this.svgDivRef, this.layerService, this.arrowTipDirectionService);
            this.diagToSvgProvider = new DiagToSvgProvider(diagToSvg);

            this.gridUpdated = this.gridUpdated.bind(this);
        }

        componentDidMount(): void {
            const diag = new AsciiDiag(this.canvasDivRef, this.layerService, this.gridDrawerFactory,
                this.diagToSvgProvider, this.cellDrawer, this.toolService, this.stateProvider,
                this.gridUpdated);
            this.shapeUpdateNotificationService.register(diag);
        }

        private handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: Tools) => {
            console.log("handle tool change: " + newTool);
            this.toolService.setCurrentTool(newTool);
            const tool = this.toolService.currentTool();

            this.setState({
                currentTool: tool,
            });

            if (tool instanceof ConnectorCreateTool) {
                this.appStateHelper.selectConnectorTool();
                this.appStateHelper.showConnectorToolOptions(undefined);
            } else if (tool instanceof TextCreateTool && !(tool instanceof TextEditTool)) {
                this.appStateHelper.selectTextTool();
                this.appStateHelper.hideToolOptions();
            } else if (tool instanceof BoxCreateTool) {
                this.appStateHelper.selectBoxTool();
                this.appStateHelper.showBoxToolOptions(undefined);
            } else if (tool instanceof SelectTool) {
                this.appStateHelper.selectSelectTool();
                this.appStateHelper.hideToolOptions();
            }
        };

        gridUpdated(grid: AsciiGrid): void {
            this.setState({
                grid: grid,
            });
        }

        private handleConnectorLineStyleChange = (event: React.MouseEvent<HTMLElement>, newLineStyle: LineStyle) => {
            console.log("handle connector line style change: " + newLineStyle);

            const shape = this.toolService.currentShape();
            if (shape && shape instanceof ConnectorShape) {
                const newShape = ConnectorShape.ShapeBuilder.from(shape).lineStyle(newLineStyle).build();
                this.toolService.selectShapeUpdateStylesTool(newShape);
            }

            this.setState({
                connectorLineStyle: newLineStyle,
            });
        };

        private handleBoxLineStyleChange = (event: React.MouseEvent<HTMLElement>, newLineStyle: LineStyle) => {
            console.log("handle box line style change: " + newLineStyle);

            const shape = this.toolService.currentShape();
            if (shape && shape instanceof BoxShape) {
                const newShape = BoxShape.ShapeBuilder.from(shape).lineStyle(newLineStyle).build();
                this.toolService.selectShapeUpdateStylesTool(newShape);
            }

            this.setState({
                boxLineStyle: newLineStyle,
            });
        };


        private handleConnectorStartTipStyleChange = (event: React.MouseEvent<HTMLElement>, newConnectorTipStyle: ConnectorTipStyle) => {
            console.log("handle connector start tip style change: " + newConnectorTipStyle);

            const shape = this.toolService.currentShape();
            if (shape && shape instanceof ConnectorShape) {
                const newShape = ConnectorShape.ShapeBuilder.from(shape).startTipStyle(newConnectorTipStyle).build();
                this.toolService.selectShapeUpdateStylesTool(newShape);
            }

            this.setState({
                connectorStartTipStyle: newConnectorTipStyle,
            });
        };

        private handleConnectorEndTipStyleChange = (event: React.MouseEvent<HTMLElement>, newConnectorTipStyle: ConnectorTipStyle) => {
            console.log("handle connector end tip style change: " + newConnectorTipStyle);

            const shape = this.toolService.currentShape();
            if (shape && shape instanceof ConnectorShape) {
                const newShape = ConnectorShape.ShapeBuilder.from(shape).endTipStyle(newConnectorTipStyle).build();
                this.toolService.selectShapeUpdateStylesTool(newShape);
            }

            this.setState({
                connectorEndTipStyle: newConnectorTipStyle,
            });
        };

        private handleBoxCornerStyleChange = (event: React.MouseEvent<HTMLElement>, boxCornerStyle: BoxCornerStyle) => {
            console.log("handle box corner style change: " + boxCornerStyle);

            const shape = this.toolService.currentShape();
            if (shape && shape instanceof BoxShape) {
                const newShape = BoxShape.ShapeBuilder.from(shape).cornerStyle(boxCornerStyle).build();
                this.toolService.selectShapeUpdateStylesTool(newShape);
            }

            this.setState({
                boxCornerStyle: boxCornerStyle,
            });
        };

        render() {
            new DiagToSvg(this.svgDivRef, this.layerService, this.arrowTipDirectionService);

            return (
                <div className={this.props.classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6">
                                ASCII Diag
                            </Typography>
                            <Button color="inherit">Login</Button>
                        </Toolbar>
                    </AppBar>
                    <Paper>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={5}>
                                <ToggleButtonGroup size="large"
                                                   value={this.state.currentTool}
                                                   exclusive
                                                   onChange={this.handleToolChange}
                                                   style={margin}>
                                    <ToggleButton value={Tools.select} style={padding}
                                                  selected={this.state.isSelectToolButtonSelected}>
                                        <CursorDefault/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.text} style={padding}
                                                  selected={this.state.isTextToolButtonSelected}>
                                        <FormatText/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.box} style={padding}
                                                  selected={this.state.isBoxToolButtonSelected}>
                                        <CheckboxBlankOutline/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.connector} style={padding}
                                                  selected={this.state.isConnectorToolButtonSelected}>
                                        <RayStartArrow/>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                {this.state.showConnectorOptions &&
                                <span>
                                        <IconMenu title="Start"
                                                  selectedIndex={this.state.connectorStartTipStyle}
                                                  onChange={this.handleConnectorStartTipStyleChange}
                                                  options={["Flat", "Arrow"]}
                                                  icons={[<Minus/>, <ArrowLeft/>]}/>

                                        <IconMenu title="Line Style"
                                                  selectedIndex={this.state.connectorLineStyle}
                                                  onChange={this.handleConnectorLineStyleChange}
                                                  options={["continuous", "dashed", "dotted"]}
                                                  icons={[<Minus/>, <CurrentDc/>, <DotsHorizontal/>]}/>

                                        <IconMenu title="End"
                                                  selectedIndex={this.state.connectorEndTipStyle}
                                                  onChange={this.handleConnectorEndTipStyleChange}
                                                  options={["Flat", "Arrow"]}
                                                  icons={[<Minus/>, <ArrowRight/>]}/>
                                    </span>
                                }
                                {this.state.showBoxOptions &&
                                <span>
                                    <IconMenu title="Line Style"
                                              selectedIndex={this.state.boxLineStyle}
                                              onChange={this.handleBoxLineStyleChange}
                                              options={["continuous", "dashed", "dotted"]}
                                              icons={[<Minus/>, <CurrentDc/>, <DotsHorizontal/>]}/>
                                    <IconMenu title="Corner Style"
                                              selectedIndex={this.state.boxCornerStyle}
                                              onChange={this.handleBoxCornerStyleChange}
                                              options={["Square Corners", "Rounded Corners"]}
                                              icons={[<SquareOutline/>, <RoundedCorner/>]}/>
                                    </span>
                                }
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <ToggleButtonGroup size="large"
                                                   value={this.state.currentTool}
                                                   exclusive
                                                   onChange={this.handleToolbar}
                                                   style={margin}>

                                    <ToggleButton value={Tools.import}
                                                  style={padding}
                                                  selected={false}>
                                        <Import/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.export}
                                                  style={padding}
                                                  selected={false}>
                                        <Export/>
                                    </ToggleButton>
                                    {this.state.showDeleteButton &&
                                    <ToggleButton value={Tools.delete}
                                                  style={padding}
                                                  selected={false}>
                                        <Delete/>
                                    </ToggleButton>
                                    }

                                </ToggleButtonGroup>
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container>
                        <Grid item sm={12} md={6}>
                            <Paper className={this.props.classes.paperStyles} style={{overflow: 'auto'}}>
                                <DiagCanvas canvasRef={this.canvasDivRef}/>
                            </Paper>
                        </Grid>
                        <Grid item sm={12} md={6}>
                            <Paper className={this.props.classes.paperStyles}>
                                <SvgCanvas divRef={this.svgDivRef}/>
                            </Paper>
                        </Grid>
                    </Grid>
                    <ExportDialog open={this.state.exportDialogOpen}
                                  onClose={this.appStateHelper.hideExportDialog}
                                  text={this.state.diagramMarkup}/>
                    <ImportDialog open={this.state.importDialogOpen}
                                  onClose={this.appStateHelper.hideImportDialog}
                                  onImport={this.appStateHelper.importDiagram}/>
                </div>
            );
        }

        private handleToolbar = (event: React.MouseEvent<HTMLElement>, newTool: Tools) => {
            console.log("handle toolbar change: " + newTool);
            switch (newTool) {
                case Tools.export:
                    const diagramMarkup = this.state.grid.toMarkup();
                    this.setState({
                        exportDialogOpen: true,
                        diagramMarkup: diagramMarkup,
                    });
                    break;
                case Tools.import:
                    this.setState({
                        importDialogOpen: true,
                    });
                    break;
                case Tools.delete:
                    const shape = this.toolService.currentShape()!;
                    this.layerService.deleteShape(shape.id());
                    this.toolService.selectSelectTool();
            }
        };

        shapeSelected(newShape: Shape | undefined): void {
            console.log("Update selected shape: " + (newShape ? newShape.constructor.name : newShape));

            if (newShape === undefined) {
                this.appStateHelper.hideToolOptions();
                this.appStateHelper.hideDeleteButton();
                return;
            }

            if (newShape && newShape instanceof ConnectorShape) {
                this.appStateHelper.showConnectorToolOptions(newShape);
            } else if (newShape && newShape instanceof BoxShape) {
                this.appStateHelper.showBoxToolOptions(newShape);
            }

            this.appStateHelper.showDeleteButton();
        }
    }
);

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
});

ReactDOM.render(<AppWithStyles/>, document.querySelector('#app'));
