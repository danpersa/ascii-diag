import React, {RefObject} from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import {createStyles, Theme, Toolbar, withStyles, WithStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import UIGrid from "@material-ui/core/Grid";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import DiagCanvas from "./diag-canvas";
import CursorDefault from "mdi-material-ui/CursorDefault";
import {
    ArrowLeft,
    ArrowRight,
    CheckboxBlankOutline,
    CurrentDc,
    DotsHorizontal,
    FormatText,
    Minus,
    RayStartArrow
} from "mdi-material-ui";
import SvgCanvas from "./svg-diag";
import {LayerService} from "./layer-service";
import Grid from "./drawers/grid";
import {DiagToSvg} from "./renderers/diag-to-svg";
import {Tools} from "./tools/tool";
import Constants from "./constants";
import {ShapeUpdateNotificationService} from "./shape-update-notification-service";
import {CellToShapeService} from "./cell-to-shape-service";
import {ConnectorTipDirectionService} from "./connector-tip-direction-service";
import IconMenu from "./icon-menu";


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

interface AppProps extends WithStyles<typeof appStyles> {

}

type AppState = {
    currentTool: Tools
}

const AppWithStyles = withStyles(appStyles)(
    class extends React.Component<AppProps, AppState> {

        private readonly canvasDivRef: RefObject<HTMLCanvasElement> = React.createRef();
        private readonly svgDivRef: RefObject<HTMLDivElement> = React.createRef();
        private readonly grid: Grid;
        private readonly layerService: LayerService;
        private readonly shapeUpdateNotificationService: ShapeUpdateNotificationService;
        private readonly cellToShapeService: CellToShapeService;
        private readonly arrowTipDirectionService: ConnectorTipDirectionService;

        constructor(props: AppProps) {
            super(props);
            this.state = {
                currentTool: Tools.box
            };
            this.grid = Grid.create(Constants.numberOfRows, Constants.numberOfColumns);
            this.shapeUpdateNotificationService = new ShapeUpdateNotificationService();
            this.layerService = new LayerService(this.shapeUpdateNotificationService);
            this.arrowTipDirectionService = new ConnectorTipDirectionService();
            this.cellToShapeService = new CellToShapeService(Constants.numberOfRows, Constants.numberOfColumns,
                this.arrowTipDirectionService, this.layerService);
            this.shapeUpdateNotificationService.register(this.cellToShapeService);
        }

        render() {

            const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: Tools) => {
                console.log("handle tool change: " + newTool);
                if (newTool) {
                    this.setState({currentTool: newTool});
                }
            };

            const diagToSvg = new DiagToSvg(this.svgDivRef, this.layerService, this.arrowTipDirectionService);

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
                        <ToggleButtonGroup size="large" value={this.state.currentTool} exclusive
                                           onChange={handleToolChange}
                                           style={margin}>
                            <ToggleButton value={Tools.select} style={padding}>
                                <CursorDefault/>
                            </ToggleButton>
                            <ToggleButton value={Tools.text} style={padding}>
                                <FormatText/>
                            </ToggleButton>
                            <ToggleButton value={Tools.box} style={padding}>
                                <CheckboxBlankOutline/>
                            </ToggleButton>
                            <ToggleButton value={Tools.connector} style={padding}>
                                <RayStartArrow/>
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <IconMenu title="Start" options={["Flat", "Arrow"]} icons={[<Minus/>, <ArrowLeft/>]}/>

                        <IconMenu title="Line Style" options={["continuous", "dashed", "dotted"]}
                                  icons={[<Minus/>, <CurrentDc/>, <DotsHorizontal/>]}/>

                        <IconMenu title="End" options={["Flat", "Arrow"]} icons={[<Minus/>, <ArrowRight/>]}/>
                    </Paper>
                    <UIGrid container>
                        <UIGrid item sm={12} md={6}>
                            <Paper className={this.props.classes.paperStyles} style={{overflow: 'auto'}}>
                                <DiagCanvas canvasRef={this.canvasDivRef}
                                            currentTool={this.state.currentTool}
                                            layerService={this.layerService}
                                            shapeUpdateNotificationService={this.shapeUpdateNotificationService}
                                            cellToShapeService={this.cellToShapeService}
                                            grid={this.grid} diagToSvg={diagToSvg}/>
                            </Paper>
                        </UIGrid>
                        <UIGrid item sm={12} md={6}>
                            <Paper className={this.props.classes.paperStyles}>
                                <SvgCanvas divRef={this.svgDivRef}/>
                            </Paper>
                        </UIGrid>
                    </UIGrid>
                </div>
            );
        }
    }
);

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
    }
});

ReactDOM.render(<AppWithStyles/>, document.querySelector('#app'));
