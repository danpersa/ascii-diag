import {Provider} from "./provider";
import {DiagToSvg} from "../renderers/diag-to-svg";


export default class DiagToSvgProvider implements Provider<DiagToSvg> {

    private diagToSvg: DiagToSvg;

    constructor(diagToSvg: DiagToSvg) {
        this.diagToSvg = diagToSvg;
    }

    get(): DiagToSvg {
        return this.diagToSvg;
    }

    set(diagToSvg: DiagToSvg) {
        this.diagToSvg = diagToSvg;
    }
}
