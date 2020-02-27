import Grid from "../drawers/grid";
import {ConnectorShape} from "../shapes/connector-shape";
import {ConnectorDirection} from "../drawers/connector";
import {ShapeIdService} from "../shapes/shape-id-service";
import ConnectorParser from "./connector-parser";

const shapeIdService = new ShapeIdService();
const parser = new ConnectorParser(shapeIdService);

describe('#parse', () => {
    it('should parse three horizontal connectors on the same row', () => {
        const grid = Grid.fromString(
            `
            ----- -- ----

            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(3);
        expect(result[0]).toBeInstanceOf(ConnectorShape);
        const connector1 = result[0] as ConnectorShape;
        expectConnectorToBe(connector1, 1, 12, 1, 16);
        expect(result[1]).toBeInstanceOf(ConnectorShape);
        const connector2 = result[1] as ConnectorShape;
        expectConnectorToBe(connector2, 1, 18, 1, 19);
        expect(result[2]).toBeInstanceOf(ConnectorShape);
        const connector3 = result[2] as ConnectorShape;
        expectConnectorToBe(connector3, 1, 21, 1, 24);
    });

    it('should parse a connector with a + starting horizontally', () => {
        const grid = Grid.fromString(
            `
            -----+
                 |
                 |
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(ConnectorShape);
        const connector1 = result[0] as ConnectorShape;
        expectConnectorToBe(connector1, 1, 12, 3, 17);
        expect(connector1.startDirection).toBe(ConnectorDirection.Horizontal);
    });

    it('should parse a connector with a + starting vertically', () => {
        const grid = Grid.fromString(
            `
            +-----
            |
            |
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(1);
        expect(result[0]).toBeInstanceOf(ConnectorShape);
        const connector1 = result[0] as ConnectorShape;
        expectConnectorToBe(connector1, 1, 17, 3, 12);
        expect(connector1.startDirection).toBe(ConnectorDirection.Vertical);
    });

    it('should parse two connectors touching', () => {
        const grid = Grid.fromString(
            `
            |
            +--
            +-----
            |
            |
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(2);
        expect(result[0]).toBeInstanceOf(ConnectorShape);
        const connector1 = result[0] as ConnectorShape;
        expectConnectorToBe(connector1, 2, 14, 1, 12);
        expect(connector1.startDirection).toBe(ConnectorDirection.Vertical);

        expect(result[1]).toBeInstanceOf(ConnectorShape);
        const connector2 = result[1] as ConnectorShape;
        expectConnectorToBe(connector2, 3, 17, 5, 12);
        expect(connector2.startDirection).toBe(ConnectorDirection.Vertical);
    });

    it('should parse more connectors', () => {
        const grid = Grid.fromString(
            `
            +----- -----+
            |           |
            |   ---     |
                        |
            `
        );
        const result = parser.parse(grid);
        expect(result.length).toBe(3);
        expect(result[0]).toBeInstanceOf(ConnectorShape);
        const connector1 = result[0] as ConnectorShape;
        expectConnectorToBe(connector1, 1, 17, 3, 12);
        expect(connector1.startDirection).toBe(ConnectorDirection.Vertical);

        const connector2 = result[1] as ConnectorShape;
        expectConnectorToBe(connector2, 1, 19, 4, 24);
        expect(connector2.startDirection).toBe(ConnectorDirection.Horizontal);

        const connector3 = result[2] as ConnectorShape;
        expectConnectorToBe(connector3, 3, 16, 3, 18);
        expect(connector3.startDirection).toBe(ConnectorDirection.Horizontal);
    });
});

export function expectConnectorToBe(connector: ConnectorShape, startRow: number, startColumn: number, endRow: number, endColumn: number) {
    expect(connector.startRow).toBe(startRow);
    expect(connector.startColumn).toBe(startColumn);
    expect(connector.endRow).toBe(endRow);
    expect(connector.endColumn).toBe(endColumn);
}
