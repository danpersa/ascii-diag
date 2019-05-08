import Grid from "./grid";
import {Entity} from "./entities/entity";

export class LayerService {

    private entities: Array<Entity>;
    private grid: Grid;

    constructor(grid: Grid) {
        this.entities = new Array<Entity>();
        this.grid = grid;
    }

    addEntity(entity: Entity) {
        console.log("add entity: " + entity);
        this.entities.push(entity);
    }

    getEntity(row: number, column: number): Entity | undefined {
        return this.entities.filter(entity => {
            return entity.cells().some(cell => cell.row == row && cell.column == column)
        }).pop();
    }
}
