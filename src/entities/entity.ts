import {Domain} from "../cell";

export interface Entity {
    cells(): Array<Domain.Cell>
}
