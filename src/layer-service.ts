import Grid from "./grid";
import {Entity} from "./entities/entity";

export class LayerService {

    private readonly _entities: Array<Entity>;
    private readonly grid: Grid;

    constructor(grid: Grid) {
        this._entities = [];
        this.grid = grid;
    }

    createEntity(entity: Entity) {
        console.log("add entity: " + entity);
        this._entities.push(entity);
    }

    getEntity(row: number, column: number): Entity | undefined {
        return this._entities.filter(entity => {
            //console.log("Cells size: " + entity.cells().length);
            return entity.cells().some(cell => cell.row == row && cell.column == column)
        }).pop();
    }

    get entities(): Array<Entity> {
        return this._entities;
    }

    updateEntity(entity: Entity): void {
        console.log("update entity");
        let index: number | null = null;
        this.entities.forEach((e, i) => {
            if (e.id() == entity.id()) {
                index = i;
            }
        });
        if (index != null) {
            this.entities[index] = entity;
        }
    }
}
