import {Shape} from "ascii-diag-renderer";

export enum ShapeUpdateEvent {
    CREATED, UPDATED, DELETED
}

export interface ShapeUpdateListener {
    update(event: ShapeUpdateEvent, shape: Shape): void;
}

export class ShapeUpdateNotificationService {
    private readonly listeners: Array<ShapeUpdateListener> = [];

    register(listener: ShapeUpdateListener): void {
        this.listeners.push(listener);
    }

    notify(event: ShapeUpdateEvent, shape: Shape): void {
        this.listeners.forEach((listener: ShapeUpdateListener) => {
            listener.update(event, shape);
        });
    }
}
