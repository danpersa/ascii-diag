import * as React from "react";
import Constants from "./constants";
import {RefObject} from "react";
import AsciiDiag from "./ascii-diag";
import Grid from "./grid";
import {LayerService} from "./layer-service";
import {DiagToSvg} from "./svg/diag-to-svg";
import {Tools} from "./tools/tool";
import {ToolService} from "./tools/tool-service";
import {CellDrawer} from "./cell-drawer";
import {GridDrawer} from "./grid-drawer";
import {CanvasVertexDrawer, VertexDrawer} from "./vertex-drawer";
import {CanvasSelectBoxDrawer} from "./select-box-drawer";
import {BoxDrawer} from "./box-drawer";
import {ArrowDrawer} from "./arrow-drawer";
import {TextDrawer} from "./text-drawer";
import {CursorDrawer} from "./cursor-drawer";
import {EntityIdService} from "./entities/entity-id-service";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";

type DiagCanvasProps = {
    canvasRef: RefObject<HTMLCanvasElement>,
    currentTool: Tools,
    grid: Grid,
    layerService: LayerService,
    diagToSvg: DiagToSvg
}

export default class DiagCanvas extends React.Component<DiagCanvasProps> {

    private toolService: ToolService | null = null;

    constructor(props: DiagCanvasProps) {
        super(props);
    }

    componentDidMount() {

        const canvas = this.props.canvasRef.current!;
        const grid = this.props.grid;
        const entityIdService = new EntityIdService();
        const layerService = this.props.layerService;
        const context = canvas.getContext("2d")!;


        const arrowTipDirectionService = new ArrowTipDirectionService();
        const cellDrawer = new CellDrawer(context, grid);
        const vertexDrawer = new CanvasVertexDrawer(context);
        const selectBoxDrawer = new CanvasSelectBoxDrawer(context, vertexDrawer);
        const boxDrawer = new BoxDrawer(cellDrawer);
        const arrowDrawer = new ArrowDrawer(cellDrawer, arrowTipDirectionService);
        const textDrawer = new TextDrawer(cellDrawer);
        const cursorDrawer = new CursorDrawer(context);

        this.toolService = new ToolService(grid, layerService, selectBoxDrawer, boxDrawer,
            entityIdService, textDrawer, cursorDrawer, vertexDrawer, arrowDrawer);

        new AsciiDiag(canvas, this.props.grid, this.props.layerService, this.props.diagToSvg, cellDrawer, this.toolService, context);
    }

    render() {

        if (this.toolService) {
            this.toolService.setCurrentTool(this.props.currentTool);
        }
        return (
            <div>
                <canvas ref={this.props.canvasRef} width={Constants.canvasWidth} height={Constants.canvasHeight}/>
            </div>
        )
    }
}
