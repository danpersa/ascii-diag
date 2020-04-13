import {Provider} from "./provider";
import {DiagToSvgReact} from "../renderers/diag-to-svg-react";


export default class DiagToSvgProvider implements Provider<DiagToSvgReact> {

    private diagToSvg: DiagToSvgReact;

    constructor(diagToSvg: DiagToSvgReact) {
        this.diagToSvg = diagToSvg;
    }

    get(): DiagToSvgReact {
        return this.diagToSvg;
    }

    set(diagToSvg: DiagToSvgReact) {
        this.diagToSvg = diagToSvg;
    }
}
