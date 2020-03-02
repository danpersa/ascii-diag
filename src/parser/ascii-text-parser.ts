import {Shape} from "../shapes/shape";
import Grid from "../drawers/grid";
import {Domain} from "../drawers/cell";
import {BoxShape} from "../shapes/box-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {GridBoxDrawer} from "../drawers/box-drawer";
import BoxParser from "./box-parser";
import ConnectorParser from "./connector-parser";
import TextParser from "./text-parser";
import {GridTextDrawer} from "../drawers/text-drawer";
import {TextShape} from "../shapes/text-shape";


export default class AsciiTextParser {
    private readonly shapeIdService: ShapeIdService;
    private readonly boxParser: BoxParser;
    private readonly connectorParser: ConnectorParser;
    private readonly textParser: TextParser;

    constructor(shapeIdService: ShapeIdService) {
        this.shapeIdService = shapeIdService;
        this.boxParser = new BoxParser(shapeIdService);
        this.connectorParser = new ConnectorParser(shapeIdService);
        this.textParser = new TextParser(shapeIdService);
    }

    parse(grid: Grid): Array<Shape> {
        const texts = this.textParser.parse(grid);


        const boxes = this.boxParser.parse(grid);

        // create a grid containing only the boxes and texts
        const gridWithTextsAndBoxes = Grid.create(grid.rows(), grid.columns());
        const gridBoxDrawer = new GridBoxDrawer(gridWithTextsAndBoxes);
        const gridTextDrawer = new GridTextDrawer(gridWithTextsAndBoxes);

        texts.forEach(text => gridTextDrawer.draw(text as TextShape));
        boxes.forEach(box => gridBoxDrawer.draw(box as BoxShape));


        //console.log("Here is the grid with boxes:\n" + gridWithTextsAndBoxes.toMarkup());

        // remove the boxes from the original grid
        const gridWithoutTextsAndBoxes = grid.difference(gridWithTextsAndBoxes);

        //console.log("Here is the grid without texts and boxes:\n" + gridWithoutTextsAndBoxes.toMarkup());

        const connectors: Array<Shape> = this.connectorParser.parse(gridWithoutTextsAndBoxes);

        return texts.concat(boxes).concat(connectors);
    }
}
