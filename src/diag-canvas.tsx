import * as React from "react";
import {RefObject} from "react";
import Constants from "./constants";
import AsciiDiag from "./ascii-diag";
import Grid from "./drawers/grid";
import {LayerService} from "./layer-service";
import {DiagToSvg} from "./renderers/diag-to-svg";
import {Tools} from "./tools/tool";
import {ToolService} from "./tools/tool-service";
import {CanvasCellDrawer} from "./drawers/cell-drawer";
import {CanvasVertexDrawer} from "./drawers/vertex-drawer";
import {CanvasSelectBoxDrawer} from "./drawers/select-box-drawer";
import {CanvasArrowDrawer} from "./drawers/arrow-drawer";
import {CanvasTextDrawer} from "./drawers/text-drawer";
import {CanvasCursorDrawer} from "./drawers/cursor-drawer";
import {ShapeIdService} from "./shapes/shape-id-service";
import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import {CanvasBoxDrawer} from "./drawers/box-drawer";
import {ShapeUpdateNotificationService} from "./shape-update-notification-service";
import {CellToShapeService} from "./cell-to-shape-service";
import {GridDrawerFactory} from "./drawers/drawer-factory";

type DiagCanvasProps = {
    canvasRef: RefObject<HTMLCanvasElement>,
    currentTool: Tools,
    grid: Grid,
    layerService: LayerService,
    shapeUpdateNotificationService: ShapeUpdateNotificationService,
    cellToShapeService: CellToShapeService,
    diagToSvg: DiagToSvg
}

export default class DiagCanvas extends React.Component<DiagCanvasProps> {

    private toolService: ToolService | null = null;

    constructor(props: DiagCanvasProps) {
        super(props);
    }

    componentDidMount() {

        const canvas = this.props.canvasRef.current!;
        const entityIdService = new ShapeIdService();
        const layerService = this.props.layerService;
        const context = canvas.getContext("2d")!;

        const arrowTipDirectionService = new ArrowTipDirectionService();
        const cellDrawer = new CanvasCellDrawer(context);
        const vertexDrawer = new CanvasVertexDrawer(context);
        const selectBoxDrawer = new CanvasSelectBoxDrawer(context, vertexDrawer);
        const boxDrawer = new CanvasBoxDrawer(cellDrawer);
        const arrowDrawer = new CanvasArrowDrawer(cellDrawer, arrowTipDirectionService);
        const textDrawer = new CanvasTextDrawer(cellDrawer);
        const cursorDrawer = new CanvasCursorDrawer(context);
        const gridDrawerFactory = new GridDrawerFactory(arrowTipDirectionService);

        this.toolService = new ToolService(layerService, selectBoxDrawer, boxDrawer, entityIdService, textDrawer,
            cursorDrawer, vertexDrawer, arrowDrawer, this.props.cellToShapeService);

        new AsciiDiag(canvas, this.props.layerService, gridDrawerFactory,
            this.props.diagToSvg, cellDrawer, this.toolService, context);
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
