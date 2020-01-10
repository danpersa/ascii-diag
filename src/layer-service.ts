import Grid from "./drawers/grid";
import {Entity} from "./entities/entity";

export class LayerService {

    private readonly _entities: Array<Entity>;

    constructor() {
        this._entities = [];
    }

    createEntity(entity: Entity) {
        console.log("add entity: " + entity);
        this._entities.push(entity);
    }

    getEntity(row: number, column: number): Entity | undefined {
        return this._entities.filter(entity => {
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

    deleteEntity(id: number): void {
        const entityIndex = this.entities.findIndex(entity => entity.id() === id);
        if (entityIndex > -1) {
            this.entities.splice(entityIndex, 1);
        }
    }
}
