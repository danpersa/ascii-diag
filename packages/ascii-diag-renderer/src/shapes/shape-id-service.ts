export class ShapeIdService {

    private currentId: number = 0;

    nextId() {
        return this.currentId++;
    }
}
