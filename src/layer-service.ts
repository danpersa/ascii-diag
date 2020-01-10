import Grid from "./drawers/grid";
import {Shape} from "./shapes/shape";

export class LayerService {

    private readonly _entities: Array<Shape>;

    constructor() {
        this._entities = [];
    }

    createEntity(entity: Shape) {
        console.log("add entity: " + entity);
        this._entities.push(entity);
    }

    getEntity(row: number, column: number): Shape | undefined {
        return this._entities.filter(entity => {
            return entity.cells().some(cell => cell.row == row && cell.column == column)
        }).pop();
    }

    get entities(): Array<Shape> {
        return this._entities;
    }

    updateEntity(entity: Shape): void {
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
