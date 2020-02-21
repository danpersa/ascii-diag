import Grid from "../drawers/grid";

describe('fromString', () => {
    beforeEach(() => {
    });

    it('should create a grid from a String', () => {
        const grid = Grid.fromString(
            `+---+
|   |
+---+`);
        expect(grid.rows()).toBe(3);
        expect(grid.columns()).toBe(5);
    });

    it('should create a grid from a String using the longest row', () => {
        const grid = Grid.fromString(
            `+---+
|   |-->
+---+`);
        expect(grid.rows()).toBe(3);
        expect(grid.columns()).toBe(8);
    });

    it('should create a grid from a String using the longest row', () => {
        const grid = Grid.fromString(
            `
            +---+
            |   |
            +---+

            `);
        expect(grid.rows()).toBe(6);
        expect(grid.columns()).toBe(17);
    });
});
