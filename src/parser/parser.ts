import Grid from "../drawers/grid";
import {Shape} from "../shapes/shape";

export default interface ShapeParser {
    parse(grid: Grid): Array<Shape>;
}