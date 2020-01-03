import * as React from "react";
import {RefObject} from "react";
import Constants from "./constants";
import AsciiDiag from "./ascii-diag";
import Grid from "./drawer/grid";
import {LayerService} from "./layer-service";
import {DiagToSvg} from "./svg/diag-to-svg";
import {Tools} from "./tools/tool";
import {ToolService} from "./tools/tool-service";
import {CanvasCellDrawer} from "./drawer/cell-drawer";
import {CanvasVertexDrawer} from "./drawer/vertex-drawer";
import {CanvasSelectBoxDrawer} from "./drawer/select-box-drawer";
import {CanvasArrowDrawer} from "./drawer/arrow-drawer";
import {CanvasTextDrawer} from "./drawer/text-drawer";
import {CanvasCursorDrawer} from "./drawer/cursor-drawer";
import {EntityIdService} from "./entities/entity-id-service";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import {CanvasBoxDrawer} from "./drawer/box-drawer";

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
        const cellDrawer = new CanvasCellDrawer(context, grid);
        const vertexDrawer = new CanvasVertexDrawer(context);
        const selectBoxDrawer = new CanvasSelectBoxDrawer(context, vertexDrawer);
        const boxDrawer = new CanvasBoxDrawer(cellDrawer);
        const arrowDrawer = new CanvasArrowDrawer(cellDrawer, arrowTipDirectionService);
        const textDrawer = new CanvasTextDrawer(cellDrawer);
        const cursorDrawer = new CanvasCursorDrawer(context);

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
