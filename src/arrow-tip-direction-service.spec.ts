import {ArrowTipDirectionService} from "./arrow-tip-direction-service";
import {Arrow, ArrowDirection, ArrowTipDirection} from "./drawers/arrow";

const arrowTipDirectionService: ArrowTipDirectionService = new ArrowTipDirectionService();

describe('startTipDirection: should give the correct tip direction for', () => {

    it('a vertical arrow pointing down', () => {
        const arrow = new Arrow(0, 0, 2, 0,
            ArrowDirection.Vertical);
        const dir = arrowTipDirectionService.startTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.North);
    });

    it('a vertical arrow pointing up', () => {
        const arrow = new Arrow(2, 0, 0, 0,
            ArrowDirection.Vertical);
        const dir = arrowTipDirectionService.startTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.South);
    });

    it('a horizontal arrow pointing right', () => {
        const arrow = new Arrow(0, 0, 0, 2,
            ArrowDirection.Horizontal);
        const dir = arrowTipDirectionService.startTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.West);
    });

    it('a horizontal arrow pointing left', () => {
        const arrow = new Arrow(0, 2, 0, 0,
            ArrowDirection.Horizontal);
        const dir = arrowTipDirectionService.startTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.East);
    });

    describe('an arrow which starts horizontal', () => {
        it('pointing right and points down', () => {
            const arrow = new Arrow(0, 0, 2, 2,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.West);
        });

        it('pointing right and points up', () => {
            const arrow = new Arrow(2, 0, 0, 2,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.West);
        });

        it('pointing left and points down', () => {
            const arrow = new Arrow(0, 2, 2, 0,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.East);
        });

        it('pointing left and points up', () => {
            const arrow = new Arrow(2, 2, 0, 0,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.East);
        });
    });

    describe('an arrow which starts vertical', () => {
        it('pointing down and points right', () => {
            const arrow = new Arrow(0, 0, 2, 2,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.North);
        });

        it('pointing up and points right', () => {
            const arrow = new Arrow(2, 0, 0, 2,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.South);
        });

        it('pointing down and points left', () => {
            const arrow = new Arrow(0, 2, 2, 0,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.North);
        });

        it('pointing up and points left', () => {
            const arrow = new Arrow(2, 2, 0, 0,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.startTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.South);
        });
    });
});

describe('endTipDirection: should give the correct tip direction for', () => {

    it('a vertical arrow pointing down', () => {
        const arrow = new Arrow(0, 0, 2, 0,
            ArrowDirection.Vertical);
        const dir = arrowTipDirectionService.endTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.South);
    });

    it('a vertical arrow pointing up', () => {
        const arrow = new Arrow(2, 0, 0, 0,
            ArrowDirection.Vertical);
        const dir = arrowTipDirectionService.endTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.North);
    });

    it('a horizontal arrow pointing right', () => {
        const arrow = new Arrow(0, 0, 0, 2,
            ArrowDirection.Horizontal);
        const dir = arrowTipDirectionService.endTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.East);
    });

    it('a horizontal arrow pointing left', () => {
        const arrow = new Arrow(0, 2, 0, 0,
            ArrowDirection.Horizontal);
        const dir = arrowTipDirectionService.endTipDirection(arrow);
        expect(dir).toBe(ArrowTipDirection.West);
    });

    describe('an arrow which starts horizontal', () => {
        it('pointing right and points down', () => {
            const arrow = new Arrow(0, 0, 2, 2,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.South);
        });

        it('pointing right and points up', () => {
            const arrow = new Arrow(2, 0, 0, 2,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.North);
        });

        it('pointing left and points down', () => {
            const arrow = new Arrow(0, 2, 2, 0,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.South);
        });

        it('pointing left and points up', () => {
            const arrow = new Arrow(2, 2, 0, 0,
                ArrowDirection.Horizontal);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.North);
        });
    });

    describe('an arrow which starts vertical', () => {
        it('pointing down and points right', () => {
            const arrow = new Arrow(0, 0, 2, 2,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.East);
        });

        it('pointing up and points right', () => {
            const arrow = new Arrow(2, 0, 0, 2,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.East);
        });

        it('pointing down and points left', () => {
            const arrow = new Arrow(0, 2, 2, 0,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.West);
        });

        it('pointing up and points left', () => {
            const arrow = new Arrow(2, 2, 0, 0,
                ArrowDirection.Vertical);
            const dir = arrowTipDirectionService.endTipDirection(arrow);
            expect(dir).toBe(ArrowTipDirection.West);
        });
    });
});
