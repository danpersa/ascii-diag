import Grid from "../drawers/grid";
import {BoxShape} from "../shapes/box-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import BoxParser from "./box-parser";
import {Shape} from "../shapes/shape";

const shapeIdService = new ShapeIdService();
const parser = new BoxParser(shapeIdService);

describe('#parse', () => {
    it('should parse a text with a box', () => {
        const grid = Grid.fromString(
            `
            +---+
            |   |
            +---+

            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expectBoxToBe(result[0], 1, 3, 12, 16);
    });

    it('should parse a text with two boxes', () => {
        const grid = Grid.fromString(
            `
            +---+  +----+
            |   |  |    |
            +---+  |    |
                   +----+
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(2);
        expectBoxToBe(result[0], 1, 3, 12, 16);
        expectBoxToBe(result[1], 1, 4, 19, 24);
    });

    it('should parse a text with two boxes sharing an edge', () => {
        const grid = Grid.fromString(
            `
            +----+
            |    |
            +-+--+
              |  |
              +--+ 
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(2);
        expectBoxToBe(result[0], 1, 3, 12, 17);
        expectBoxToBe(result[1], 3, 5, 14, 17);
    });

    it('should parse a text with two boxes one containing the other', () => {
        const grid = Grid.fromString(
            `
            +------+
            |  +-+ |
            |  | | |
            |  +-+ |
            +------+ 
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(2);

        expectBoxToBe(result[0], 1, 5, 12, 19);
        expectBoxToBe(result[1], 2, 4, 15, 17);
    });

    it('should parse a text with two boxes one containing the other and sharing a corner', () => {
        const grid = Grid.fromString(
            `
            +---+--+
            |   |  |
            |   |  |
            +---+  |
            +------+
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(2);

        expectBoxToBe(result[0], 1, 4, 12, 16);
        expectBoxToBe(result[1], 1, 5, 12, 19);
    });

    it('should parse a text with three boxes sharing some edges', () => {
        const grid = Grid.fromString(
            `
            +----+
            |    |
            |    +--+
            ++---+  |
             |   +--+
             +---+ 
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(3);

        expectBoxToBe(result[0], 1, 4, 12, 17);
        expectBoxToBe(result[1], 3, 5, 17, 20);
        expectBoxToBe(result[2], 4, 6, 13, 17);
    });

    it('should parse a text with two boxes sharing a whole edge', () => {
        const grid = Grid.fromString(
            `
            +----+
            |    |
            +----+
            |    |
            +----+ 
            `
        );
        // TODO make this pass, right now returns 3 boxes, one containing the union of the first two
    });

    it('should parse a text with more boxes and connectors', () => {
        const grid = Grid.fromString(
            `
            +---+  +----+---+
            |   |--|    +---+
            +---+  |    |
              |    |    |
              +----|    |
                   +----+
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(3);
        expectBoxToBe(result[0], 1, 3, 12, 16);
        expectBoxToBe(result[1], 1, 6, 19, 24);
        expectBoxToBe(result[2], 1, 2, 24, 28);
    });

    it('should parse a text with a box with rounded corners', () => {
    });

    it('should parse a text with a box with dashed lines', () => {
    });
});

export function expectBoxToBe(shape: Shape, topRow: number, bottomRow: number, leftColumn: number, rightColumn: number) {
    expect(shape).toBeInstanceOf(BoxShape);
    const boxShape = shape as BoxShape;
    expect(boxShape.topRow).toBe(topRow);
    expect(boxShape.bottomRow).toBe(bottomRow);
    expect(boxShape.leftColumn).toBe(leftColumn);
    expect(boxShape.rightColumn).toBe(rightColumn);
}
