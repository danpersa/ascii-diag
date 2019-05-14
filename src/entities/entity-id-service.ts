export class EntityIdService {

    private currentId: number = 0;

    nextId() {
        return this.currentId++;
    }
}
