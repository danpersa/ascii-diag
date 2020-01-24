import {Shape} from "./shape";
import {Connector, ConnectorDirection} from "../drawers/connector";

export class ConnectorShape extends Connector implements Shape {

    private readonly _id: number;
    private _editing: boolean = false;

    constructor(id: number, startRow: number, startColumn: number, endRow: number, endColumn: number, startDirection: ConnectorDirection) {
        super(startRow, startColumn, endRow, endColumn, startDirection);
        this._id = id;
    }

    id(): number {
        return this._id;
    }

    editing(): boolean {
        return this._editing;
    }

    endEditing(): void {
        this._editing = false;
    }

    startEditing(): void {
        this._editing = true;
    }
}