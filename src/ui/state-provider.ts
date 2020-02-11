import {AppState} from "./app-state";
import React from "react";
import {Provider} from "./provider";

export class StateProvider implements Provider<Readonly<AppState>> {

    private readonly component: React.Component<any, AppState>;

    constructor(component: React.Component<any, AppState>) {
        this.component = component;
    }

    get(): Readonly<AppState> {
        return this.component.state;
    }
}
