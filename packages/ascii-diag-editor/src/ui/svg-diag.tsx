import * as React from "react";
import {RefObject} from "react";
import {Constants} from "ascii-diag-renderer";

type SvgCanvasProps = {
    divRef: RefObject<HTMLDivElement>
}

export default class SvgCanvas extends React.Component<SvgCanvasProps> {

    constructor(props: SvgCanvasProps) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div ref={this.props.divRef}>
                <svg width={Constants.canvasWidth} height={Constants.canvasHeight}/>
            </div>
        )
    }
}
