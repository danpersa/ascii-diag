import Grid from "../drawers/grid";
import {ConnectorShape} from "../shapes/connector-shape";
import {ConnectorDirection} from "../drawers/connector";
import {ShapeIdService} from "../shapes/shape-id-service";
import ConnectorParser from "./connector-parser";
import TextParser from "./text-parser";
import {TextShape} from "../shapes/text-shape";

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
        expect(result[0]).toBeInstanceOf(TextShape);
        const text1 = result[0] as TextShape;
        expectTextToBe(text1, 1, 12, 'Hello');
    });

    it('should parse a simple text with spaces', () => {
        const grid = Grid.fromString(
            `
            Hello world
            `
        );

        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(TextShape);
        const text1 = result[0] as TextShape;
        expectTextToBe(text1, 1, 12, 'Hello world');
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
        expect(result[0]).toBeInstanceOf(TextShape);
        expectTextToBe(result[0] as TextShape, 1, 12, 'Hello');
        expectTextToBe(result[1] as TextShape, 1, 19, 'world');
        expectTextToBe(result[2] as TextShape, 2, 12, 'Great job');
    });

    it('should parse a containing the char v', () => {
        const grid = Grid.fromString(
            `
            Hello void
            `
        );

        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(TextShape);
        expectTextToBe(result[0] as TextShape, 1, 12, 'Hello void');
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
        expect(result[0]).toBeInstanceOf(TextShape);
        expectTextToBe(result[0] as TextShape, 2, 14, 'Hi');
        expectTextToBe(result[1] as TextShape, 3, 22, 'Bow Wow');
    });
});

export function expectTextToBe(connector: TextShape, startRow: number, startColumn: number, text: string) {
    expect(connector.row).toBe(startRow);
    expect(connector.column).toBe(startColumn);
    expect(connector.text).toBe(text);
}
