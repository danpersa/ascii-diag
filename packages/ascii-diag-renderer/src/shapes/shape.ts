export interface Shape {

    id(): number;

    editing(): boolean;

    startEditing(): void;

    endEditing(): void;
}
