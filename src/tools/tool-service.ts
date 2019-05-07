import Grid from '../grid'
import {Tool} from "./tool";
import {ArrowTool} from "./arrow-tool";
import {BoxTool} from "./box-tool";
import {TextTool} from "./text-tool";

export class ToolService {

    private readonly boxTool: Tool;
    private readonly arrowTool: Tool;
    private readonly textTool: Tool;
    private tool: Tool;

    constructor(grid: Grid) {
        this.boxTool = new BoxTool(grid);
        this.arrowTool = new ArrowTool(grid);
        this.textTool = new TextTool(grid);
        this.tool = this.textTool;
    }

    currentTool(): Tool {
        return this.tool;
    }

    selectBoxTool(): void {
        this.tool = this.boxTool;
    }

    selectArrowTool(): void {
        this.tool = this.arrowTool;
    }

    selectTextTool(): void {
        this.tool = this.textTool;
    }
}
