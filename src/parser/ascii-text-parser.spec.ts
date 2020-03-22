import Grid from "../drawers/grid";
import AsciiTextParser from "./ascii-text-parser";
import {BoxShape} from "../shapes/box-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import {expectBoxToBe} from "./box-parser.spec";
import {ConnectorShape} from "../shapes/connector-shape";
import {expectTextToBe} from "./text-parser.spec";
import {expectConnectorToHaveHorizontalEdge, expectConnectorToHaveVerticalEdge} from "./connector-parser.spec";

const shapeIdService = new ShapeIdService();
const parser = new AsciiTextParser(shapeIdService);

describe('parse', () => {

    it('should parse a diagram with boxes and connectors', () => {
        const grid = Grid.fromString(
            `
            +---+     +----+
            |   |-----|    |
            +---+     |    |
               |      |    |
               +------|    |
                      +----+
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(4);
        expect(result[0]).toBeInstanceOf(BoxShape);
        const box1 = result[0] as BoxShape;
        expectBoxToBe(box1, 1, 3, 12, 16);

        expect(result[1]).toBeInstanceOf(BoxShape);
        const box2 = result[1] as BoxShape;
        expectBoxToBe(box2, 1, 6, 22, 27);

        expect(result[2]).toBeInstanceOf(ConnectorShape);
        const connector1 = result[2] as ConnectorShape;

        expectConnectorToHaveHorizontalEdge(connector1, 2, 17, 2, 21);

        expect(result[3]).toBeInstanceOf(ConnectorShape);
        const connector2 = result[3] as ConnectorShape;
        expectConnectorToHaveHorizontalEdge(connector2, 5, 21, 5, 15);
        expectConnectorToHaveVerticalEdge(connector2, 4, 15, 5, 15);
    });

    it('should parse a diagram with boxes, texts and connectors', () => {
        const grid = Grid.fromString(
            `                                                      
                +--------+                                                        
                |        |                                                        
                | Animal |                                                        
                |        |                                                        
                +--------+                                                        
                   |  |                                                           
                   |  |                                                           
                   |  |                                                           
      +-----+      |  |       +-----+                                             
      |     |      |  |       |     |                                             
      | Cat |------+  +-------| Dog |                                             
      |     |                 |     |                                             
      +-----+                 +-----+                                        
            `);
        const result = parser.parse(grid);
        expect(result.length).toBe(8);

        expectTextToBe(result[0], 3, 18, 'Animal');
        expectTextToBe(result[1], 11, 8, 'Cat');
        expectTextToBe(result[2], 11, 32, 'Dog');

        expectBoxToBe(result[3], 1, 5, 16, 25);
        expectBoxToBe(result[4], 9, 13, 6, 12);
        expectBoxToBe(result[5], 9, 13, 30, 36);


        expectConnectorToHaveHorizontalEdge(result[6], 11, 13, 11, 19);
        expectConnectorToHaveVerticalEdge(result[6], 6, 19, 11, 19);

        expectConnectorToHaveHorizontalEdge(result[7], 11, 29, 11, 22);
        expectConnectorToHaveVerticalEdge(result[7], 6, 22, 11, 22);
    })
});
