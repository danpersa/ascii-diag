import {Domain} from "../drawers/cell";

export interface Shape {

    id(): number;

    cells(): Array<Domain.Cell>

    editing(): boolean;

    startEditing(): void;

    endEditing(): void;
}
