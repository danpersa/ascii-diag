import Grid from "./grid";
import {Entity} from "./entities/entity";

export class LayerService {

    private layers: Array<Entity>;
    private grid: Grid;

    constructor(grid: Grid) {
        this.layers = new Array<Entity>();
        this.grid = grid;
    }

    addEntity(entity: Entity) {
        this.layers.push(entity);
    }
}
