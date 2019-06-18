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
import {CheckboxBlankOutline, FormatText, RayStartArrow} from "mdi-material-ui";
import SvgCanvas from "./svg-diag";
import {LayerService} from "./layer-service";
import Grid from "./grid";
import {DiagToSvg} from "./svg/diag-to-svg";
import {Tool, Tools} from "./tools/tool";


const appStyles = (theme: Theme) => createStyles({
    root: {
        flexGrow: 1,
        margin: 10
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    paperStyles: {
        marginTop: theme.spacing(1),
    }
});

interface AppProps extends WithStyles<typeof appStyles> {

}

type AppState = {
    currentTool: Tools
}

const AppWithStyles = withStyles(appStyles)(
    class extends React.Component<AppProps, AppState> {

        private readonly canvasDivRef: RefObject<HTMLCanvasElement> = React.createRef();
        private readonly svgDivRef: RefObject<HTMLDivElement> = React.createRef();

        constructor(props: AppProps) {
            super(props);
            this.state = {
                currentTool: Tools.box
            };
        }

        render() {

            const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: Tools) => {
                console.log("handle tool change: " + newTool);
                if (newTool) {
                    this.setState({currentTool: newTool});
                }
            };

            const grid = new Grid();
            const layerService = new LayerService(grid);
            const diagToSvg = new DiagToSvg(this.svgDivRef, layerService);

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
                    <AppBar position="static" color="default">
                        <Toolbar>
                            <div>
                                <ToggleButtonGroup value={this.state.currentTool} exclusive onChange={handleToolChange}>
                                    <ToggleButton value={Tools.select}>
                                        <CursorDefault/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.text}>
                                        <FormatText/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.box}>
                                        <CheckboxBlankOutline/>
                                    </ToggleButton>
                                    <ToggleButton value={Tools.arrow}>
                                        <RayStartArrow/>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </Toolbar>
                    </AppBar>
                    <UIGrid container spacing={2}>
                        <UIGrid item sm={12} md={6}>
                            <Paper className={this.props.classes.paperStyles}>
                                <DiagCanvas canvasRef={this.canvasDivRef}
                                            currentTool={this.state.currentTool}
                                            layerService={layerService}
                                            grid={grid} diagToSvg={diagToSvg}/>
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

ReactDOM.render(<AppWithStyles/>, document.querySelector('#app'));
