import Grid from "../drawers/grid";
import {ConnectorShape} from "../shapes/connector-shape";
import {ShapeIdService} from "../shapes/shape-id-service";
import ConnectorParser from "./connector-parser";
import {Shape} from "../shapes/shape";

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
        expectConnectorToBe(result[0], 1, 12, 1, 16);
        expectConnectorToBe(result[1], 1, 18, 1, 19);
        expectConnectorToBe(result[2], 1, 21, 1, 24);
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
        expectConnectorToBe(result[0], 1, 12, 3, 17);
        //expect(connector1.startDirection).toBe(ConnectorDirection.Horizontal);
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
        expectConnectorToBe(result[0], 1, 17, 3, 12);
        //expect(connector1.startDirection).toBe(ConnectorDirection.Vertical);
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
        expectConnectorToBe(result[0], 2, 14, 1, 12);
        //expect(connector1.startDirection).toBe(ConnectorDirection.Vertical);

        expectConnectorToBe(result[1], 3, 17, 5, 12);
        //expect(connector2.startDirection).toBe(ConnectorDirection.Vertical);
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
        expectConnectorToBe(result[0], 1, 17, 3, 12);
        //expect(connector1.startDirection).toBe(ConnectorDirection.Vertical);

        expectConnectorToBe(result[1], 1, 19, 4, 24);
        //expect(result[1].startDirection).toBe(ConnectorDirection.Horizontal);

        expectConnectorToBe(result[2], 3, 16, 3, 18);
        //expect(result[2].startDirection).toBe(ConnectorDirection.Horizontal);
    });
});

export function expectConnectorToBe(shape: Shape, startRow: number, startColumn: number, endRow: number, endColumn: number) {
    expect(shape).toBeInstanceOf(ConnectorShape);
    const connectorShape = shape as ConnectorShape;
    expect(connectorShape.startRow).toBe(startRow);
    expect(connectorShape.startColumn).toBe(startColumn);
    expect(connectorShape.endRow).toBe(endRow);
    expect(connectorShape.endColumn).toBe(endColumn);
}
