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

        expectConnectorToHaveHorizontalEdge(result[0], 1, 12, 1, 16);
        expectConnectorToHaveHorizontalEdge(result[1], 1, 18, 1, 19);
        expectConnectorToHaveHorizontalEdge(result[2], 1, 21, 1, 24);
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
        expectConnectorToHaveHorizontalEdge(result[0], 1, 12, 1, 17);
        expectConnectorToHaveVerticalEdge(result[0], 3, 17, 1, 17);
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
        expectConnectorToHaveHorizontalEdge(result[0], 1, 17, 1, 12);
        expectConnectorToHaveVerticalEdge(result[0], 3, 12, 1, 12);
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
        expectConnectorToHaveHorizontalEdge(result[0], 2, 14, 2, 12);
        expectConnectorToHaveVerticalEdge(result[0], 1, 12, 2, 12);

        expectConnectorToHaveHorizontalEdge(result[1], 3, 17, 3, 12);
        expectConnectorToHaveVerticalEdge(result[1], 5, 12, 3, 12);
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
        expectConnectorToHaveHorizontalEdge(result[0], 1, 17, 1, 12);
        expectConnectorToHaveVerticalEdge(result[0], 3, 12, 1, 12);

        expectConnectorToHaveHorizontalEdge(result[1], 1, 19, 1, 24);
        expectConnectorToHaveVerticalEdge(result[1], 4, 24, 1, 24);

        expectConnectorToHaveHorizontalEdge(result[2], 3, 16, 3, 18);
    });
});

export function expectConnectorToHaveHorizontalEdge(shape: Shape, startRow: number, startColumn: number, endRow: number, endColumn: number) {
    expect(shape).toBeInstanceOf(ConnectorShape);
    const connectorShape = shape as ConnectorShape;
    expect(connectorShape.connectorType.horizontalEdge).toBeDefined();
    expect(connectorShape.connectorType.horizontalEdge!.start.row).toBe(startRow);
    expect(connectorShape.connectorType.horizontalEdge!.start.column).toBe(startColumn);
    expect(connectorShape.connectorType.horizontalEdge!.end.row).toBe(endRow);
    expect(connectorShape.connectorType.horizontalEdge!.end.column).toBe(endColumn);
    ;
}

export function expectConnectorToHaveVerticalEdge(shape: Shape, startRow: number, startColumn: number, endRow: number, endColumn: number) {
    expect(shape).toBeInstanceOf(ConnectorShape);
    const connectorShape = shape as ConnectorShape;
    expect(connectorShape.connectorType.verticalEdge).toBeDefined();
    expect(connectorShape.connectorType.verticalEdge!.start.row).toBe(startRow);
    expect(connectorShape.connectorType.verticalEdge!.start.column).toBe(startColumn);
    expect(connectorShape.connectorType.verticalEdge!.end.row).toBe(endRow);
    expect(connectorShape.connectorType.verticalEdge!.end.column).toBe(endColumn);

}
