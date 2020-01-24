import {ConnectorTipDirectionService} from "./connector-tip-direction-service";
import {Connector, ConnectorDirection, ConnectorTipDirection} from "./drawers/connector";

const connectorTipDirectionService: ConnectorTipDirectionService = new ConnectorTipDirectionService();

describe('startTipDirection: should give the correct tip direction for', () => {

    it('a vertical connector pointing down', () => {
        const connector = new Connector(0, 0, 2, 0,
            ConnectorDirection.Vertical);
        const dir = connectorTipDirectionService.startTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.North);
    });

    it('a vertical connector pointing up', () => {
        const connector = new Connector(2, 0, 0, 0,
            ConnectorDirection.Vertical);
        const dir = connectorTipDirectionService.startTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.South);
    });

    it('a horizontal connector pointing right', () => {
        const connector = new Connector(0, 0, 0, 2,
            ConnectorDirection.Horizontal);
        const dir = connectorTipDirectionService.startTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.West);
    });

    it('a horizontal connector pointing left', () => {
        const connector = new Connector(0, 2, 0, 0,
            ConnectorDirection.Horizontal);
        const dir = connectorTipDirectionService.startTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.East);
    });

    describe('an connector which starts horizontal', () => {
        it('pointing right and points down', () => {
            const connector = new Connector(0, 0, 2, 2,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.West);
        });

        it('pointing right and points up', () => {
            const connector = new Connector(2, 0, 0, 2,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.West);
        });

        it('pointing left and points down', () => {
            const connector = new Connector(0, 2, 2, 0,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.East);
        });

        it('pointing left and points up', () => {
            const connector = new Connector(2, 2, 0, 0,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.East);
        });
    });

    describe('an connector which starts vertical', () => {
        it('pointing down and points right', () => {
            const connector = new Connector(0, 0, 2, 2,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.North);
        });

        it('pointing up and points right', () => {
            const connector = new Connector(2, 0, 0, 2,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.South);
        });

        it('pointing down and points left', () => {
            const connector = new Connector(0, 2, 2, 0,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.North);
        });

        it('pointing up and points left', () => {
            const connector = new Connector(2, 2, 0, 0,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.startTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.South);
        });
    });
});

describe('endTipDirection: should give the correct tip direction for', () => {

    it('a vertical connector pointing down', () => {
        const connector = new Connector(0, 0, 2, 0,
            ConnectorDirection.Vertical);
        const dir = connectorTipDirectionService.endTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.South);
    });

    it('a vertical connector pointing up', () => {
        const connector = new Connector(2, 0, 0, 0,
            ConnectorDirection.Vertical);
        const dir = connectorTipDirectionService.endTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.North);
    });

    it('a horizontal connector pointing right', () => {
        const connector = new Connector(0, 0, 0, 2,
            ConnectorDirection.Horizontal);
        const dir = connectorTipDirectionService.endTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.East);
    });

    it('a horizontal connector pointing left', () => {
        const connector = new Connector(0, 2, 0, 0,
            ConnectorDirection.Horizontal);
        const dir = connectorTipDirectionService.endTipDirection(connector);
        expect(dir).toBe(ConnectorTipDirection.West);
    });

    describe('an connector which starts horizontal', () => {
        it('pointing right and points down', () => {
            const connector = new Connector(0, 0, 2, 2,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.South);
        });

        it('pointing right and points up', () => {
            const connector = new Connector(2, 0, 0, 2,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.North);
        });

        it('pointing left and points down', () => {
            const connector = new Connector(0, 2, 2, 0,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.South);
        });

        it('pointing left and points up', () => {
            const connector = new Connector(2, 2, 0, 0,
                ConnectorDirection.Horizontal);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.North);
        });
    });

    describe('an connector which starts vertical', () => {
        it('pointing down and points right', () => {
            const connector = new Connector(0, 0, 2, 2,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.East);
        });

        it('pointing up and points right', () => {
            const connector = new Connector(2, 0, 0, 2,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.East);
        });

        it('pointing down and points left', () => {
            const connector = new Connector(0, 2, 2, 0,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.West);
        });

        it('pointing up and points left', () => {
            const connector = new Connector(2, 2, 0, 0,
                ConnectorDirection.Vertical);
            const dir = connectorTipDirectionService.endTipDirection(connector);
            expect(dir).toBe(ConnectorTipDirection.West);
        });
    });
});
