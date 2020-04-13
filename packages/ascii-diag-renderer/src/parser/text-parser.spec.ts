import {Grid} from "../entities/grid";
import TextParser from "./text-parser";
import {TextShape} from "../shapes/text-shape";
import {Shape} from "../shapes/shape";
import {ShapeIdService} from "../shapes/shape-id-service";

const shapeIdService = new ShapeIdService();
const parser = new TextParser(shapeIdService);

describe('#parse', () => {

    it('should parse a simple text', () => {
        const grid = Grid.fromString(
            `
            Hello
            `
        );

        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expectTextToBe(result[0], 1, 12, 'Hello');
    });

    it('should parse a simple text with spaces', () => {
        const grid = Grid.fromString(
            `
            Hello world
            `
        );

        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expectTextToBe(result[0], 1, 12, 'Hello world');
    });

    it('should parse a simple text with more spaces and rows', () => {
        const grid = Grid.fromString(
            `
            Hello  world
            Great job
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(3);
        expectTextToBe(result[0], 1, 12, 'Hello');
        expectTextToBe(result[1], 1, 19, 'world');
        expectTextToBe(result[2], 2, 12, 'Great job');
    });

    it('should parse a containing the char v', () => {
        const grid = Grid.fromString(
            `
            Hello void
            `
        );

        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expectTextToBe(result[0], 1, 12, 'Hello void');
    });

    it('should parse the text from a diagram with text, boxes and connectors', () => {
        const grid = Grid.fromString(
            `
            +----+  +---------+
            | Hi |--|         |
            +----+  | Bow Wow |
              |     |         |
              +-----|         |
                    +---------+
            `
        );

        const result = parser.parse(grid);
        expect(result.length).toBe(2);
        expectTextToBe(result[0], 2, 14, 'Hi');
        expectTextToBe(result[1], 3, 22, 'Bow Wow');
    });
});

export function expectTextToBe(shape: Shape, startRow: number, startColumn: number, text: string) {
    expect(shape).toBeInstanceOf(TextShape);
    const textShape = shape as TextShape;
    expect(textShape.row).toBe(startRow);
    expect(textShape.column).toBe(startColumn);
    expect(textShape.text).toBe(text);
}
