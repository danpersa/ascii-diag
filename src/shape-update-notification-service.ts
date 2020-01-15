import {Shape} from "./shapes/shape";

export interface ShapeUpdateListener {
    update(shape: Shape): void;
}

export class ShapeUpdateNotificationService {
    private readonly listeners: Array<ShapeUpdateListener> = [];

    register(listener: ShapeUpdateListener): void {
        this.listeners.push(listener);
    }

    notify(shape: Shape): void {
        this.listeners.forEach((listener: ShapeUpdateListener) => {
            listener.update(shape);
        });
    }
}
