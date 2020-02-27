import {Shape} from "../shapes/shape";
import Grid from "../drawers/grid";
import {Domain} from "../drawers/cell";
import {BoxCornerStyle} from "../drawers/box";
import {ConnectorDirection, LineStyle} from "../drawers/connector";
import {BoxShape} from "../shapes/box-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {GridBoxDrawer} from "../drawers/box-drawer";
import {ConnectorShape} from "../shapes/connector-shape";
import Cell = Domain.Cell;
import BoxParser from "./box-parser";
import ConnectorParser from "./connector-parser";


export default class AsciiTextParser {
    private readonly shapeIdService: ShapeIdService;
    private readonly boxParser: BoxParser;
    private readonly connectorParser: ConnectorParser;

    constructor(shapeIdService: ShapeIdService) {
        this.shapeIdService = shapeIdService;
        this.boxParser = new BoxParser(shapeIdService);
        this.connectorParser = new ConnectorParser(shapeIdService);
    }

    parse(grid: Grid): Array<Shape> {
        const boxes = this.boxParser.parse(grid);

        // create a grid containing only the boxes
        const gridWithBoxes = Grid.create(grid.rows(), grid.columns());
        const gridBoxDrawer = new GridBoxDrawer(gridWithBoxes);
        boxes.forEach(box => gridBoxDrawer.draw(box as BoxShape));

        //console.log("Here is the grid with boxes:\n" + gridWithBoxes.toMarkup());

        // remove the boxes from the original grid
        const gridWithoutBoxes = grid.difference(gridWithBoxes);

        console.log("Here is the grid without boxes:\n" + gridWithoutBoxes.toMarkup());

        const connectors: Array<Shape> = this.connectorParser.parse(gridWithoutBoxes);

        return boxes.concat(connectors);
    }
}
