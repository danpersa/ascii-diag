import {Shape} from "./shapes/shape";
import {ShapeUpdateEvent, ShapeUpdateNotificationService} from "./shape-update-notification-service";

export class LayerService {

    private readonly shapeUpdateNotificationService: ShapeUpdateNotificationService;

    private readonly _shapes: Array<Shape>;

    constructor(shapeUpdateNotificationService: ShapeUpdateNotificationService) {
        this._shapes = [];
        this.shapeUpdateNotificationService = shapeUpdateNotificationService;
    }

    createShape(shape: Shape) {
        console.log("add shape: " + shape);
        this._shapes.push(shape);
        this.shapeUpdateNotificationService.notify(ShapeUpdateEvent.CREATED, shape);
    }

    get shapes(): Array<Shape> {
        return this._shapes;
    }

    updateShape(shape: Shape): void {
        console.log("update shape");
        let index: number | null = null;
        this.shapes.forEach((s, i) => {
            if (s.id() == shape.id()) {
                index = i;
            }
        });
        if (index != null) {
            this.shapes[index] = shape;
            this.shapeUpdateNotificationService.notify(ShapeUpdateEvent.UPDATED, shape);
        }
    }

    deleteShape(id: number): void {
        const index = this.shapes.findIndex(shape => shape.id() === id);
        if (index > -1) {
            const shape = this.shapes[index];
            console.log("Remove layer for shape: " + shape);
            this.shapes.splice(index, 1);
            this.shapeUpdateNotificationService.notify(ShapeUpdateEvent.DELETED, shape);
        }
    }
}
